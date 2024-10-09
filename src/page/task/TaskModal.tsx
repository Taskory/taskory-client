// TaskModal.tsx
import React, { useState } from 'react';
import { useTaskModal } from "./TaskModalContext";

interface TaskModalProps {
    loading: boolean;
    tags: { id: number; title: string; color: string }[];
    hashtags: { id: number; name: string }[];
}

const TaskModal: React.FC<TaskModalProps> = ({
                                                 loading,
                                                 tags,
                                                 hashtags,
                                             }) => {
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [hashtagTitle, setHashtagTitle] = useState('');
    const [currentHashtags, setCurrentHashtags] = useState(hashtags);

    const handleHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagTitle.trim() !== '') {
            setCurrentHashtags([...currentHashtags, { id: Date.now(), name: hashtagTitle.trim() }]);
            setHashtagTitle('');
        }
    };

    const handleSave = () => {
        // Logic to save the task
        console.log('Saving task with title:', title);
    };

    return (
        <dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
            <div className="modal-box max-w-md p-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-4">  {/* Create a 2-column grid layout */}
                            <div className="col-span-3 py-2">
                                <input
                                    type="text"
                                    className="input input-ghost w-full font-bold"
                                    value={title}
                                    placeholder={"Task title"}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 content-center">
                                <div className={"flex items-center"}>
                                    <p className="text-red-600">●</p>
                                    <select
                                        className="select select-sm w-full ml-1"
                                        value={tagId !== undefined ? tagId : ''}
                                        onChange={(e) => setTagId(Number(e.target.value))}
                                    >
                                        <option value="">Tag</option>
                                        {tags.map(tag => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag.title} ({tag.color})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="label text-sm justify-end mr-1">Status</label>
                            </div>
                            <div className="col-span-3 space-y-1 py-1">
                                <select
                                    className="select select-sm w-full"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="label text-sm justify-end mr-1">Hashtags</label>
                            </div>
                            <div className="col-span-3">
                                <div>
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
                            </div>
                            <div className="col-span-1">
                                <label className="label text-sm justify-end mr-1">Description</label>
                            </div>
                            <div className="col-span-3">
                                <textarea
                                    className="textarea textarea-bordered textarea-sm w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>
                                {selectedTaskId ? 'Update' : 'Save'}
                            </button>
                            {/*{selectedTaskId && (*/}
                            {/*    <button className="btn btn-error btn-sm" onClick={() => { if (handleDelete) handleDelete(); }}>Delete</button>*/}
                            {/*)}*/}
                            <button className="btn btn-outline btn-sm" onClick={closeTaskModal}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default TaskModal;