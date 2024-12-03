// TaskModal.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTaskModal} from "../../../context/modal/TaskModalContext";
import {request_createTask, request_getTaskById, request_updateTask} from "../../../api/task/TaskApi";
import {SaveTaskRequest, TaskResponse, TaskStatus, TaskItemResponse} from "../../../api/task/TaskTypes";
import {TagSelectBox} from '../../../component/TagSelectBox';
import {useTagContext} from "../../../context/data/TagContext";
import { TaskItemCard } from './TaskItemCard';

interface TaskModalProps {
    loading: boolean;
    selectedStatus: TaskStatus | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ loading, selectedStatus }) => {
    /* Context */
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const { userTags } = useTagContext();

    const tagOptions = useMemo(() => userTags, [userTags]);

    /* useState */
    const [task, setTask] = useState<TaskResponse>({
        id: null,
        title: '',
        event: null,
        tag: tagOptions[0],
        hashtags: [],
        description: '',
        status: TaskStatus.TO_DO,
        items: [],
    });

    const [newTaskItemTitle, setNewTaskItemTitle] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /* variables and functions */
    const resetTaskStatus = useCallback((): void => {
        setTask({
            id: null,
            title: '',
            event: null,
            tag: tagOptions[0],
            hashtags: [],
            description: '',
            status: TaskStatus.TO_DO,
            items: [],
        });
    }, [tagOptions]);

    const fetchTask = useCallback(async (taskId: number): Promise<void> => {
        setIsLoading(true);
        try {
            const response: TaskResponse = await request_getTaskById(taskId);
            setTask({
                id: response.id,
                title: response.title,
                event: response.event ? response.event : null,
                tag: response.tag,
                hashtags: response.hashtags,
                description: response.description,
                status: response.status as TaskStatus,
                items: response.items,
            });
        } catch (e) {
            console.error('Failed to fetch task:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        const saveTaskRequest: SaveTaskRequest = {
            title: task.title,
            eventId: task.event?.id ?? null,
            tagId: task.tag?.id ?? null,
            hashtagIds: task.hashtags.map(hashtag => hashtag.id),
            description: task.description,
            status: task.status,
        };

        try {
            if (selectedTaskId) {
                await request_updateTask(selectedTaskId, saveTaskRequest);
            } else {
                await request_createTask(saveTaskRequest);
            }
            closeTaskModal();
        } catch (error) {
            console.error('Error saving task:', error);
        } finally {
            setIsSaving(false);
        }
    }, [task, selectedTaskId, closeTaskModal]);

    const handleAddTaskItem = useCallback(() => {
        if (newTaskItemTitle.trim() !== '') {
            const newTaskItem: TaskItemResponse = {
                id: Date.now(), // Temporary ID
                title: newTaskItemTitle,
                completed: false,
                taskId: task.id ?? -1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setTask((prevTask) => ({
                ...prevTask,
                items: [...prevTask.items, newTaskItem],
            }));
            setNewTaskItemTitle('');
        }
    }, [newTaskItemTitle, task.id]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskItem();
        }
    }, [handleAddTaskItem]);

    const handleEditTaskItem = useCallback((itemId: number, newTitle: string) => {
        setTask((prevTask) => ({
            ...prevTask,
            items: prevTask.items.map((item) =>
                item.id === itemId ? { ...item, title: newTitle } : item
            ),
        }));
    }, []);

    /* useEffect */
    useEffect(() => {
        if (isModalOpen) {
            if (selectedTaskId) {
                fetchTask(selectedTaskId);
            } else {
                resetTaskStatus();
            }
        }
    }, [isModalOpen, fetchTask, resetTaskStatus, selectedStatus, selectedTaskId]);

    /* Progress Calculation */
    const calculateProgress = useMemo((): number => {
        if (task.items.length === 0) return 0;
        const completedItems = task.items.filter(item => item.completed).length;
        return Math.round((completedItems / task.items.length) * 100);
    }, [task.items]);

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner"></span>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
            <dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
                <div className="modal-box max-w-lg p-6 rounded-lg shadow-xl">
                    {(loading || isLoading || isSaving) ? (
                        <LoadingSpinner />
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        className="input input-ghost w-full text-lg font-semibold border-b-2 focus:outline-none focus:border-blue-500"
                                        value={task.title}
                                        placeholder="Enter Task Title"
                                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1 content-center">
                                    <TagSelectBox
                                        list={tagOptions}
                                        tagState={task.tag}
                                        setTagState={(valueOrUpdater) =>
                                            setTask((prevTask) =>
                                                typeof valueOrUpdater === 'function'
                                                    ? { ...prevTask, tag: valueOrUpdater(prevTask.tag) }
                                                    : { ...prevTask, tag: valueOrUpdater }
                                            )
                                        }
                                    />
                                </div>
                                <label className="col-span-1 text-sm text-right mt-2 mr-1">Status</label>
                                <div className="col-span-3">
                                    <div className="flex space-x-2">
                                        <label className="cursor-pointer flex-1">
                                            <input
                                                type="radio"
                                                name="status"
                                                className="hidden"
                                                value={TaskStatus.TO_DO}
                                                checked={task.status === TaskStatus.TO_DO}
                                                onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                            />
                                            <div
                                                className={`w-full text-center py-2 border-2 rounded-lg text-sm transition-colors ${
                                                    task.status === TaskStatus.TO_DO ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                To Do
                                            </div>
                                        </label>
                                        <label className="cursor-pointer flex-1">
                                            <input
                                                type="radio"
                                                name="status"
                                                className="hidden"
                                                value={TaskStatus.IN_PROGRESS}
                                                checked={task.status === TaskStatus.IN_PROGRESS}
                                                onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                            />
                                            <div
                                                className={`w-full text-center py-2 border-2 rounded-lg text-sm transition-colors ${
                                                    task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                In Progress
                                            </div>
                                        </label>
                                        <label className="cursor-pointer flex-1">
                                            <input
                                                type="radio"
                                                name="status"
                                                className="hidden"
                                                value={TaskStatus.DONE}
                                                checked={task.status === TaskStatus.DONE}
                                                onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                            />
                                            <div
                                                className={`w-full text-center py-2 border-2 rounded-lg text-sm transition-colors ${
                                                    task.status === TaskStatus.DONE ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Done
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <label className="col-span-1 text-sm text-right mt-2 mr-1">Hashtags</label>
                                <div className="col-span-3">
                                    {/* TODO: handle hashtags*/}
                                </div>
                                <label className="col-span-1 text-sm text-right mt-2 mr-1">Description</label>
                                <textarea
                                    className="col-span-3 textarea textarea-bordered textarea-sm w-full resize-none focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    value={task.description}
                                    onChange={(e) => setTask({...task, description: e.target.value})}
                                    rows={3}
                                    placeholder="Enter Task Description"
                                />
                                <label className="col-span-1 text-sm text-right mt-2 mr-1">Checklist</label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm flex-1 focus:outline-none focus:border-blue-500"
                                        placeholder="New checklist item"
                                        value={newTaskItemTitle}
                                        onChange={(e) => setNewTaskItemTitle(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddTaskItem}>
                                        Add
                                    </button>
                                </div>
                                <div className="col-span-4 mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-blue-600 h-4 rounded-full text-xs font-medium text-center text-white"
                                            style={{ width: `${calculateProgress}%` }}
                                        >
                                            {calculateProgress}%
                                        </div>
                                    </div>
                                </div>
                                <ul className="col-span-4 space-y-2 h-52 overflow-y-auto mt-2">
                                    {task.items.map((item) => (
                                        <TaskItemCard
                                            key={item.id}
                                            item={item}
                                            onToggle={() =>
                                                setTask((prevTask) => ({
                                                    ...prevTask,
                                                    items: prevTask.items.map((i) =>
                                                        i.id === item.id ? { ...i, completed: !i.completed } : i
                                                    ),
                                                }))
                                            }
                                            onDelete={() =>
                                                setTask((prevTask) => ({
                                                    ...prevTask,
                                                    items: prevTask.items.filter((i) => i.id !== item.id),
                                                }))
                                            }
                                            onEdit={(newTitle) => handleEditTaskItem(item.id, newTitle)}
                                        />
                                    ))}
                                </ul>
                            </div>
                            <div className="flex gap-4 justify-end mt-6">
                                <button type="submit" className="btn btn-primary btn-md">
                                    {selectedTaskId ? 'Update Task' : 'Save Task'}
                                </button>
                                <button type="button" className="btn btn-outline btn-md" onClick={closeTaskModal}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};
