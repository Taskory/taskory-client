// TaskModal.tsx
import React, {useEffect, useState} from 'react';
import {useTaskModal} from "../context/TaskModalContext";
import {request_createTask, request_getTaskById, request_updateTask} from "../../../api/task/TaskApi";
import {SaveTaskRequest, TaskResponse, TaskStatus} from "../../../api/task/TaskTypes";
import { TagSelectBox } from '../../../component/TagSelectBox';
import {useTagContext} from "../../../context/data/TagContext";
import {TagResponse} from "../../../api/tag/TagTypes";

interface TaskModalProps {
    loading: boolean;
    selectedStatus: TaskStatus | null;
}

// Task type for internal state management
interface Task {
    id?: number;
    title: string;
    eventId?: number | undefined | null;
    tag?: TagResponse | undefined | null;
    hashtagIds: number[];
    description: string;
    status: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({ loading, selectedStatus }) => {
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const {userTags} = useTagContext();

    const [task, setTask] = useState<Task>({
        title: '',
        eventId: undefined,
        tag: undefined,
        hashtagIds: [],
        description: '',
        status: TaskStatus.TO_DO,
    });

    // const [hashtagTitle, setHashtagTitle] = useState<string>('');

    useEffect(() => {
        if (isModalOpen) {
            if (selectedTaskId) {
                fetchTask(selectedTaskId);
            } else {
                setTask({
                    title: '',
                    eventId: undefined,
                    tag: undefined,
                    hashtagIds: [],
                    description: '',
                    status: selectedStatus ? selectedStatus : TaskStatus.TO_DO,
                });
                // setHashtagTitle('');
            }
        }
    }, [isModalOpen, selectedStatus, selectedTaskId]);

    const fetchTask = async (taskId: number): Promise<void> => {
        try {
            const response: TaskResponse = await request_getTaskById(taskId);
            setTask({
                id: response.id,
                title: response.title,
                eventId: response.event ? response.event.id : undefined,
                tag: response.tag ?? undefined,
                hashtagIds: response.hashtags.map(hashtag => hashtag.id),
                description: response.description,
                status: response.status as TaskStatus,
            });
        } catch (e) {
            console.error('Failed to fetch task:', e);
        }
    }

    // const handleHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter' && hashtagTitle.trim() !== '') {
    //         if (!task.hashtagIds.includes(Date.now())) {
    //             setTask({
    //                 ...task,
    //                 hashtagIds: [...task.hashtagIds, Date.now()]
    //             });
    //         }
    //         setHashtagTitle('');
    //     }
    // };

    const handleSave = async () => {
        const saveTaskRequest: SaveTaskRequest = {
            title: task.title,
            eventId: task.eventId ?? undefined,
            tagId: task.tag?.id ?? undefined,
            hashtagIds: task.hashtagIds,
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
                            <div className="col-span-1 content-center">
                                <TagSelectBox
                                    list={userTags}
                                    tagState={task.tag}
                                    setTagState={(valueOrUpdater) =>
                                        setTask((prevTask: Task) =>
                                            typeof valueOrUpdater === 'function'
                                                ? { ...prevTask, tag: valueOrUpdater(prevTask.tag) }
                                                : { ...prevTask, tag: valueOrUpdater }
                                        )
                                    }
                                />
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
                                {/* TODO: handle hashtags*/}
                                {/*<input*/}
                                {/*    type="text"*/}
                                {/*    placeholder="Type hashtag and press Enter"*/}
                                {/*    className="input input-bordered input-sm w-full"*/}
                                {/*    value={hashtagTitle}*/}
                                {/*    onChange={(e) => setHashtagTitle(e.target.value)}*/}
                                {/*    onKeyDown={handleHashtagKeyPress}*/}
                                {/*/>*/}
                                {/*<div className="mt-1 flex flex-wrap">*/}
                                {/*    {task.hashtagIds.map(hashtagId => (*/}
                                {/*        <span key={hashtagId} className="badge badge-secondary m-1">*/}
                                {/*            #{hashtagId}*/}
                                {/*        </span>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
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