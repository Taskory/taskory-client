// TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { useTaskModal } from "./TaskModalContext";
import { getAllTags } from "../../api/tag/TagApi";
import {createTask, getTaskById, updateTask} from "../../api/task/TaskApi";
import { SaveTaskRequest, TaskResponse } from "../../api/task/TaskTypes";
import {TagResponse} from "../../api/tag/TagTypes";

interface TaskModalProps {
    loading: boolean;
}

// Task type for internal state management
interface Task {
    id?: number;
    title: string;
    eventId?: number | undefined;
    tagId?: number | undefined;
    hashtagIds: number[];
    description: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
}

export const TaskModal: React.FC<TaskModalProps> = ({ loading }) => {
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();

    const [task, setTask] = useState<Task>({
        title: '',
        eventId: undefined,
        tagId: undefined,
        hashtagIds: [],
        description: '',
        status: 'TO_DO',
    });
    const [tagsState, setTagsState] = useState<TagResponse[]>([]);
    const [hashtagTitle, setHashtagTitle] = useState<string>('');

    useEffect(() => {
        if (isModalOpen) {
            fetchTags();
            if (selectedTaskId) {
                fetchTask(selectedTaskId);
            } else {
                resetForm();
            }
        }
    }, [isModalOpen, selectedTaskId]);

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
                status: response.status as 'TO_DO' | 'IN_PROGRESS' | 'DONE',
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

    const resetForm = (): void => {
        setTask({
            title: '',
            eventId: undefined,
            tagId: undefined,
            hashtagIds: [],
            description: '',
            status: 'TO_DO',
        });
        setHashtagTitle('');
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
                                <p className="text-red-600">●</p>
                                <select
                                    className="select select-sm w-full ml-1"
                                    value={task.tagId ?? ''}
                                    onChange={(e) => setTask({ ...task, tagId: Number(e.target.value) || undefined })}
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
                            <select
                                className="col-span-3 select select-sm w-full"
                                value={task.status}
                                onChange={(e) => setTask({ ...task, status: e.target.value as 'TO_DO' | 'IN_PROGRESS' | 'DONE' })}
                            >
                                <option value="TO_DO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Completed</option>
                            </select>
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
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <button type="submit" className="btn btn-primary btn-sm">
                                {selectedTaskId ? 'Update' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={closeTaskModal}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </dialog>
    );
};