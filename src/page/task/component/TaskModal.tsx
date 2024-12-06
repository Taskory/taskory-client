// TaskModal.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTaskModal} from "../../../context/modal/TaskModalContext";
import {request_createTask, request_getTaskById, request_updateTask} from "../../../api/task/TaskApi";
import {SaveTaskRequest, TaskItemDto, TaskResponse, TaskStatus} from "../../../api/task/TaskTypes";
import {TagSelectBox} from '../../../component/TagSelectBox';
import {useTagContext} from "../../../context/data/TagContext";
import {EventSummary} from "../../../api/event/EventsTypes";
import {TagResponse} from "../../../api/tag/TagTypes";
import {HashtagResponse} from "../../../api/hashtag/HashtagTypes";
import {TaskItemSection} from "./TaskItemSection";

interface TaskModalProps {
    selectedStatus: TaskStatus;
}

type TaskModalState = {
    id: number | null;
    title: string;
    event: EventSummary | null;
    tag: TagResponse;
    hashtags: HashtagResponse[];
    description: string;
    status: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ selectedStatus }) => {
    /* Context */
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const { userTags } = useTagContext();

    const tagOptions = useMemo(() => userTags, [userTags]);

    /* useState */
    const [task, setTask] = useState<TaskModalState>({
        id: null,
        title: '',
        event: null,
        tag: tagOptions[0],
        hashtags: [],
        description: '',
        status: selectedStatus,
    });
    const [taskItems, setTaskItems] = useState<TaskItemDto[]>([]);

    useEffect(() => {
        console.log(taskItems);
    }, [taskItems]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    /* variables and functions */
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
            });
            setTaskItems(response.items);
        } catch (e) {
            console.error('Failed to fetch task:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSave = useCallback(async () => {
        setIsLoading(true);
        const saveTaskRequest: SaveTaskRequest = {
            title: task.title,
            eventId: task.event?.id ?? null,
            tagId: task.tag?.id ?? null,
            hashtagIds: task.hashtags.map(hashtag => hashtag.id),
            description: task.description,
            status: task.status,
            items: taskItems.map((item) =>
                item.id && item.id < 0 ? {...item, id: null} : item),
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
            setIsLoading(false);
        }
    }, [task, selectedTaskId, taskItems, closeTaskModal]);



    /* useEffect */
    useEffect(() => {
        if (isModalOpen) {
            if (selectedTaskId) {
                fetchTask(selectedTaskId);
            }
        }
    }, [fetchTask, isModalOpen, selectedTaskId]);



    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner"></span>
        </div>
    );

    return (
        <div
            className={`fixed inset-0 z-50 ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
            <dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
                <div className="modal-box max-w-lg p-6 rounded-lg shadow-xl">
                    {(isLoading) ? (
                        <LoadingSpinner/>
                    ) : (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        className="input input-ghost w-full text-lg font-semibold border-b-2 focus:outline-none focus:border-blue-500"
                                        value={task.title}
                                        placeholder="Enter Task Title"
                                        onChange={(e) => setTask({...task, title: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1 content-center">
                                    <TagSelectBox
                                        list={tagOptions}
                                        tagState={task.tag}
                                        setTagState={(valueOrUpdater) =>
                                            setTask((prevTask) =>
                                                typeof valueOrUpdater === 'function'
                                                    ? {...prevTask, tag: valueOrUpdater(prevTask.tag)}
                                                    : {...prevTask, tag: valueOrUpdater}
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
                                                onChange={(e) => setTask({
                                                    ...task,
                                                    status: e.target.value as TaskStatus
                                                })}
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
                                                onChange={(e) => setTask({
                                                    ...task,
                                                    status: e.target.value as TaskStatus
                                                })}
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
                                                onChange={(e) => setTask({
                                                    ...task,
                                                    status: e.target.value as TaskStatus
                                                })}
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
                                <TaskItemSection items={taskItems} setItems={setTaskItems}/>
                            </div>
                            <div className="flex gap-4 justify-end mt-6">
                                <button type="submit" className="btn btn-primary btn-md">
                                    {selectedTaskId ? 'Update Task' : 'Save Task'}
                                </button>
                                <button type="button" className="btn btn-outline btn-md"
                                        onClick={closeTaskModal}>Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};
