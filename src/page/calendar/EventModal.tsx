import React, { useState, useEffect, KeyboardEvent } from 'react';
import { API_URL } from "../../constants";
import { format, addHours } from 'date-fns';
import { getAllTags } from "../../api/tag/TagApi";
import { createEvent, getEventById, updateEvent } from "../../api/event/EventApi"; // Added updateEvent function
import { SaveEventRequest, EventResponse } from "../../api/event/EventsTypes";
import { TagResponse } from "../../api/tag/TagTypes";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    refetchEvents: () => void; // New prop to trigger refetching events
}
interface HashtagResponse {
    id: number;
    name: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, id, refetchEvents }) => {
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
    const [loading, setLoading] = useState(false); // Tracks if event data is loading

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

    const fetchEvent = async (eventId: number) => {
        setLoading(true); // Show loading state
        try {
            const response = await getEventById(eventId); // Fetch event by ID
            if (response.status === 200) {
                const data: EventResponse = response.data;

                setTitle(data.title ?? ""); // Default to empty string if null
                setTagId(data.tag?.id ?? undefined); // Default to undefined if tag or tag.id is null
                setHashtags(data.hashtags ?? []); // Default to empty array if hashtags is null
                setHashtagIds(data.hashtags ? data.hashtags.map((hashtag) => hashtag.id) : []); // Map hashtag IDs if present, else empty array
                setDescription(data.description ?? ""); // Default to empty string if null
                setStartDateTime(data.startDateTime ?? ""); // Default to empty string if null
                setDueDateTime(data.dueDateTime ?? ""); // Default to empty string if null
                setLocation(data.location ?? ""); // Default to empty string if null
            } else {
                console.error('Failed to fetch event');
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTags();

            if (id) {
                fetchEvent(id); // Fetch event data if id is provided (edit mode)
            } else {
                const now = new Date();
                const oneHourLater = addHours(now, 1);
                const formattedStartDateTime = format(oneHourLater, 'yyyy-MM-dd\'T\'HH:00');
                setStartDateTime(formattedStartDateTime);

                const twoHoursLater = addHours(now, 2);
                const formattedDueDateTime = format(twoHoursLater, 'yyyy-MM-dd\'T\'HH:00');
                setDueDateTime(formattedDueDateTime);
            }
        }
    }, [isOpen, id]);

    const handleStartDateTimeChange = (value: string) => {
        setStartDateTime(value);

        const start = new Date(value);
        const due = addHours(start, 1); // Set due date 1 hour after start date
        const formattedDueDateTime = format(due, 'yyyy-MM-dd\'T\'HH:00');
        setDueDateTime(formattedDueDateTime);
    };

    const handleDueDateTimeChange = (value: string) => {
        setDueDateTime(value);
    };

    const handleHashtagKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && hashtagTitle.trim() !== '') {
            event.preventDefault();
            try {
                const response = await fetch(`${API_URL}/hashtags?title=${hashtagTitle}`);
                if (response.ok) {
                    const hashtagData: HashtagResponse = await response.json();
                    addHashtagToList(hashtagData); // Add fetched hashtag
                } else if (response.status === 404) {
                    const createResponse = await fetch(`${API_URL}/hashtags`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: hashtagTitle }),
                    });
                    if (createResponse.ok) {
                        const createdHashtag: HashtagResponse = await createResponse.json();
                        addHashtagToList(createdHashtag); // Add created hashtag
                    } else {
                        console.error('Failed to create hashtag');
                    }
                }
            } catch (error) {
                console.error('Error handling hashtag:', error);
            } finally {
                setHashtagTitle(''); // Reset input field
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
                if (id) {
                    const response = await updateEvent(id, eventPayload);
                    if (response.status === 200) {
                        console.log('Event successfully updated');
                        refetchEvents(); // Call refetchEvents
                        onClose();
                    } else {
                        console.error('Failed to update event');
                    }
                } else {
                    const response = await createEvent(eventPayload);
                    if (response.status === 200) {
                        refetchEvents(); // Call refetchEvents
                        onClose();
                    } else {
                        console.error('Failed to create event');
                    }
                }
            } catch (error) {
                console.error('Error saving event:', error);
            }
        } else {
            console.error('Missing required fields: title, startDateTime, or dueDateTime');
        }
    };

    const handleClose = () => {
        refetchEvents(); // Call refetchEvents when modal is closed
        onClose(); // Call onClose prop to close the modal
    };

    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box">
                {loading ? (
                    <div>Loading...</div> // Show loading indicator while fetching event data
                ) : (
                    <>
                        <h3 className="font-bold text-lg">{id ? 'Edit Event' : 'Create New Event'}</h3>
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
                                    onChange={(e) => handleDueDateTimeChange(e.target.value)}
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
                            <button className="btn" onClick={handleSave}>{id ? 'Update' : 'Save'}</button>
                            <button className="btn btn-error" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default EventModal;
