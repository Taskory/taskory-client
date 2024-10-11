// TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { useTaskModal } from "./TaskModalContext";
import {getAllTags} from "../../api/tag/TagApi";
import {createTask, updateTask} from "../../api/task/TaskApi";
import {SaveTaskRequest, TaskResponse} from "../../api/task/TaskTypes";

interface TaskModalProps {
    loading: boolean;
    tags: { id: number; title: string; color: string }[];
    hashtags: { id: number; name: string }[];
}

const TaskModal: React.FC<TaskModalProps> = ({ loading, tags, hashtags }) => {
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState<'TO_DO' | 'IN_PROGRESS' | 'DONE'>('TO_DO');
    const [description, setDescription] = useState('');
    const [hashtagTitle, setHashtagTitle] = useState('');
    const [currentHashtags, setCurrentHashtags] = useState(hashtags);
    const [tagsState, setTags] = useState(tags);
    const [eventId, setEventId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (isModalOpen) {
            fetchTags();
            if (selectedTaskId) {
                fetchTask();
            } else {
                setTitle('');
                setTagId(undefined);
                setStatus('TO_DO');
                setDescription('');
                setHashtagTitle('');
                setCurrentHashtags(hashtags);
                setEventId(undefined);
            }
        }
    }, [isModalOpen, selectedTaskId]);

    const fetchTask = async (): Promise<void> => {

    }

    const fetchTags = async (): Promise<void> => {
        try {
            const response = await getAllTags();
            if (response.status === 200) {
                setTags(response.data);
            } else {
                console.error('Failed to fetch tags');
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };


    const handleHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagTitle.trim() !== '') {
            if (!currentHashtags.some(hashtag => hashtag.name === hashtagTitle.trim())) {
                setCurrentHashtags([...currentHashtags, { id: Date.now(), name: hashtagTitle.trim() }]);
            }
            setHashtagTitle('');
        }
    };

    const handleSave = async () => {
        const saveTaskRequest: SaveTaskRequest = {
            title,
            eventId: eventId ?? undefined, // Default to 0 if eventId is undefined
            tagId: tagId ?? undefined, // Default to 0 if tagId is undefined
            hashtagIds: currentHashtags.map(hashtag => hashtag.id),
            description,
            status,
        };

        try {
            if (selectedTaskId) {
                // Update existing task
                const response: TaskResponse = await updateTask(selectedTaskId, saveTaskRequest);
                console.log('Task updated:', response);
            } else {
                // Create new task
                const response: TaskResponse = await createTask(saveTaskRequest);
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
                                    value={title}
                                    placeholder="Task title"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-red-600">●</p>
                                <select
                                    className="select select-sm w-full ml-1"
                                    value={tagId ?? ''}
                                    onChange={(e) => setTagId(Number(e.target.value) || undefined)}
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
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'TO_DO' | 'IN_PROGRESS' | 'DONE')}
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
                                    {currentHashtags.map(hashtag => (
                                        <span key={hashtag.id} className="badge badge-secondary m-1">
                                            #{hashtag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <label className="col-span-1 text-sm text-right mr-1">Description</label>
                            <textarea
                                className="col-span-3 textarea textarea-bordered textarea-sm w-full"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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

export default TaskModal;
