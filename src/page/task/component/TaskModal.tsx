// TaskModal.tsx
import React, {useEffect, useState} from 'react';
import {useTaskModal} from "../context/TaskModalContext";
import {getAllTags} from "../../../api/tag/TagApi";
import {createTask, getTaskById, updateTask} from "../../../api/task/TaskApi";
import {SaveTaskRequest, TaskResponse, TaskStatus} from "../../../api/task/TaskTypes";
import {TagResponse} from "../../../api/tag/TagTypes";

interface TaskModalProps {
    loading: boolean;
    selectedStatus: TaskStatus | null;
}

export enum TagColor {
    BLACK = "BLACK",
    RED = "RED",
    GREEN = "GREEN",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    ORANGE = "ORANGE",
    PURPLE = "PURPLE",
    BROWN = "BROWN",
    PINK = "PINK",
    CYAN = "CYAN",
    LINE = "LINE"
}

// Task type for internal state management
interface Task {
    id?: number;
    title: string;
    eventId?: number | undefined;
    tagId?: number | undefined;
    hashtagIds: number[];
    description: string;
    status: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({ loading, selectedStatus }) => {
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();

    const [task, setTask] = useState<Task>({
        title: '',
        eventId: undefined,
        tagId: undefined,
        hashtagIds: [],
        description: '',
        status: TaskStatus.TO_DO,
    });
    const [tagsState, setTagsState] = useState<TagResponse[]>([]);
    const [hashtagTitle, setHashtagTitle] = useState<string>('');

    useEffect(() => {
        if (isModalOpen) {
            fetchTags();
            if (selectedTaskId) {
                fetchTask(selectedTaskId);
            } else {
                setTask({
                    title: '',
                    eventId: undefined,
                    tagId: undefined,
                    hashtagIds: [],
                    description: '',
                    status: selectedStatus ? selectedStatus : TaskStatus.TO_DO,
                });
                setHashtagTitle('');
            }
        }
    }, [isModalOpen, selectedStatus, selectedTaskId]);

    const fetchTask = async (taskId: number): Promise<void> => {
        try {
            const response: TaskResponse = await getTaskById(taskId);
            console.log(response);
            setTask({
                id: response.id,
                title: response.title,
                eventId: response.event ? response.event.id : undefined,
                tagId: response.tag ? response.tag.id : undefined,
                hashtagIds: response.hashtags.map(hashtag => hashtag.id),
                description: response.description,
                status: response.status as TaskStatus,
            });
        } catch (e) {
            console.error('Failed to fetch task:', e);
        }
    }

    const fetchTags = async (): Promise<void> => {
        try {
            const response = await getAllTags();
            setTagsState(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const getTagColorClass = (color: string) => {
        switch (color) {
            case TagColor.RED:
                return 'text-red-600';
            case TagColor.GREEN:
                return 'text-green-600';
            case TagColor.BLUE:
                return 'text-blue-600';
            case TagColor.YELLOW:
                return 'text-yellow-600';
            case TagColor.ORANGE:
                return 'text-orange-600';
            case TagColor.PURPLE:
                return 'text-purple-600';
            case TagColor.BROWN:
                return 'text-yellow-900';
            case TagColor.PINK:
                return 'text-pink-600';
            case TagColor.CYAN:
                return 'text-cyan-600';
            case TagColor.BLACK:
                return 'text-black';
            default:
                return 'text-gray-600';
        }
    };

    const handleHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagTitle.trim() !== '') {
            if (!task.hashtagIds.includes(Date.now())) {
                setTask({
                    ...task,
                    hashtagIds: [...task.hashtagIds, Date.now()]
                });
            }
            setHashtagTitle('');
        }
    };

    const handleSave = async () => {
        const saveTaskRequest: SaveTaskRequest = {
            title: task.title,
            eventId: task.eventId ?? undefined,
            tagId: task.tagId ?? undefined,
            hashtagIds: task.hashtagIds,
            description: task.description,
            status: task.status,
        };

        try {
            let response: TaskResponse;
            if (selectedTaskId) {
                response = await updateTask(selectedTaskId, saveTaskRequest);
                console.log('Task updated:', response);
            } else {
                response = await createTask(saveTaskRequest);
                console.log('Task created:', response);
            }
            closeTaskModal();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
            <div className="modal-box max-w-md p-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-3 py-2">
                                <input
                                    type="text"
                                    className="input input-ghost w-full font-bold"
                                    value={task.title}
                                    placeholder="Task title"
                                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className={getTagColorClass(tagsState.find(tag => tag.id === task.tagId)?.color || '')}>●</p>
                                <select
                                    className="select select-sm w-full ml-1"
                                    value={task.tagId ?? ''}
                                    onChange={(e) => setTask({...task, tagId: Number(e.target.value) || undefined})}
                                >
                                    <option value="">none</option>
                                    {tagsState.map(tag => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.title} ({tag.color})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label className="col-span-1 text-sm text-right mr-1">Status</label>
                            <div className="col-span-3">
                                <div className="flex space-x-1">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="hidden"
                                            value={TaskStatus.TO_DO}
                                            checked={task.status === TaskStatus.TO_DO}
                                            onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                        />
                                        <div
                                            className={`w-24 text-center px-2 py-1 border-2 rounded-md text-sm ${
                                                task.status === TaskStatus.TO_DO ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            To Do
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="hidden"
                                            value={TaskStatus.IN_PROGRESS}
                                            checked={task.status === TaskStatus.IN_PROGRESS}
                                            onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                        />
                                        <div
                                            className={`w-24 text-center px-2 py-1 border-2 rounded-md text-sm ${
                                                task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            In Progress
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="hidden"
                                            value={TaskStatus.DONE}
                                            checked={task.status === TaskStatus.DONE}
                                            onChange={(e) => setTask({...task, status: e.target.value as TaskStatus})}
                                        />
                                        <div
                                            className={`w-24 text-center px-2 py-1 border-2 rounded-md text-sm ${
                                                task.status === TaskStatus.DONE ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            Done
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <label className="col-span-1 text-sm text-right mr-1">Hashtags</label>
                            <div className="col-span-3">
                                <input
                                    type="text"
                                    placeholder="Type hashtag and press Enter"
                                    className="input input-bordered input-sm w-full"
                                    value={hashtagTitle}
                                    onChange={(e) => setHashtagTitle(e.target.value)}
                                    onKeyDown={handleHashtagKeyPress}
                                />
                                <div className="mt-1 flex flex-wrap">
                                    {task.hashtagIds.map(hashtagId => (
                                        <span key={hashtagId} className="badge badge-secondary m-1">
                                            #{hashtagId}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <label className="col-span-1 text-sm text-right mr-1">Description</label>
                            <textarea
                                className="col-span-3 textarea textarea-bordered textarea-sm w-full"
                                value={task.description}
                                onChange={(e) => setTask({...task, description: e.target.value})}
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <button type="submit" className="btn btn-primary btn-sm">
                                {selectedTaskId ? 'Update' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={closeTaskModal}>Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </dialog>
    );
};