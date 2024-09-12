import React, { useState, useEffect, KeyboardEvent } from 'react';
import { API_URL } from "../../constants";
import { format, addHours } from 'date-fns';
import { getAllTags } from "../../api/tag/TagApi";
import { createEvent } from "../../api/event/EventApi";
import { SaveEventRequest } from "../../api/event/EventsTypes";
import { TagResponse } from "../../api/tag/TagTypes";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface HashtagResponse {
    id: number;
    name: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number | undefined>(undefined);
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [hashtagTitle, setHashtagTitle] = useState('');
    const [hashtagIds, setHashtagIds] = useState<number[]>([]);
    const [hashtags, setHashtags] = useState<HashtagResponse[]>([]);
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [dueDateTime, setDueDateTime] = useState('');
    const [location, setLocation] = useState('');

    const fetchTags = async () => {
        try {
            const response = await getAllTags();
            if (response.status === 200) {
                const data: TagResponse[] = response.data;
                setTags(data);
            } else {
                console.error('Failed to fetch tags');
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTags();

            const now = new Date();
            const oneHourLater = addHours(now, 1);
            const formattedStartDateTime = format(oneHourLater, 'yyyy-MM-dd\'T\'HH:00');
            setStartDateTime(formattedStartDateTime);

            const twoHoursLater = addHours(now, 2);
            const formattedDueDateTime = format(twoHoursLater, 'yyyy-MM-dd\'T\'HH:00');
            setDueDateTime(formattedDueDateTime);
        }
    }, [isOpen]);

    const handleStartDateTimeChange = (value: string) => {
        setStartDateTime(value);

        const start = new Date(value);
        const due = addHours(start, 1);
        const formattedDueDateTime = format(due, 'yyyy-MM-dd\'T\'HH:00');
        setDueDateTime(formattedDueDateTime);
    };

    const handleHashtagKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && hashtagTitle.trim() !== '') {
            event.preventDefault();
            try {
                const response = await fetch(`${API_URL}/hashtags?title=${hashtagTitle}`);
                if (response.ok) {
                    const hashtagData: HashtagResponse = await response.json();
                    addHashtagToList(hashtagData);
                } else if (response.status === 404) {
                    const createResponse = await fetch(`${API_URL}/hashtags`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: hashtagTitle }),
                    });
                    if (createResponse.ok) {
                        const createdHashtag: HashtagResponse = await createResponse.json();
                        addHashtagToList(createdHashtag);
                    } else {
                        console.error('Failed to create hashtag');
                    }
                }
            } catch (error) {
                console.error('Error handling hashtag:', error);
            } finally {
                setHashtagTitle('');
            }
        }
    };

    const addHashtagToList = (hashtag: HashtagResponse) => {
        setHashtags((prev) => [...prev, hashtag]);
        setHashtagIds((prev) => [...prev, hashtag.id]);
    };

    const handleSave = async () => {
        if (title && startDateTime && dueDateTime) {
            const formattedStartDateTime = new Date(startDateTime).toISOString();
            const formattedDueDateTime = new Date(dueDateTime).toISOString();

            const eventPayload: SaveEventRequest = {
                title,
                tagId,
                hashtagIds,
                description,
                startDateTime: formattedStartDateTime,
                dueDateTime: formattedDueDateTime,
                location,
            };

            try {
                const response = await createEvent(eventPayload);

                if (response.status === 200) {
                    console.log('Event successfully created:', response.data);
                    onClose();
                } else {
                    console.error('Failed to create event');
                }
            } catch (error) {
                console.error('Error creating event:', error);
            }
        } else {
            console.error('Missing required fields: title, startDateTime, or dueDateTime');
        }
    };

    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create New Event</h3>
                <div className="py-4 space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/3">Event Title:</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Tag:</label>
                        <select
                            className="select select-bordered w-full"
                            value={tagId !== undefined ? tagId : ''}
                            onChange={(e) => setTagId(Number(e.target.value))}
                        >
                            <option value="">Select a Tag</option>
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.title} ({tag.color})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Hashtags:</label>
                        <input
                            type="text"
                            placeholder="Type hashtag and press Enter"
                            className="input input-bordered w-full"
                            value={hashtagTitle}
                            onChange={(e) => setHashtagTitle(e.target.value)}
                            onKeyDown={handleHashtagKeyPress}
                        />
                    </div>

                    <div className="mt-2">
                        {hashtags.map(hashtag => (
                            <span key={hashtag.id} className="badge badge-secondary m-1">
                                #{hashtag.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Description:</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Start Date:</label>
                        <input
                            type="datetime-local"
                            className="input input-bordered w-full"
                            value={startDateTime}
                            onChange={(e) => handleStartDateTimeChange(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Due Date:</label>
                        <input
                            type="datetime-local"
                            className="input input-bordered w-full"
                            value={dueDateTime}
                            readOnly
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Location:</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={handleSave}>Save</button>
                    <button className="btn btn-error" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </dialog>
    );
};

export default EventModal;
