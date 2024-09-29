import React, { useState, useEffect, KeyboardEvent } from 'react';
import { API_URL } from "../../constants";
import { format, addHours, isBefore } from 'date-fns'; // added isBefore for date comparison
import { getAllTags } from "../../api/tag/TagApi";
import {createEvent, deleteEvent, getEventById, updateEvent} from "../../api/event/EventApi";
import { SaveEventRequest, EventResponse } from "../../api/event/EventsTypes";
import { TagResponse } from "../../api/tag/TagTypes";
import { TimeUtil } from "../../util/TimeUtil";
import {HashtagResponse} from "../../api/hashtag/HashtagTypes"; // Import the timezones from JSON

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    refetchEvents: () => void;
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
    const [loading, setLoading] = useState(false);
    const [dateError, setDateError] = useState(''); // State for error message

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

    const fetchEvent = async (eventId: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await getEventById(eventId);
            if (response.status === 200) {
                const data: EventResponse = response.data;
                setTitle(data.title ?? "");
                setTagId(data.tag?.id ?? undefined);
                setHashtags(data.hashtags ?? []);
                setHashtagIds(data.hashtags ? data.hashtags.map((hashtag) => hashtag.id) : []);
                setDescription(data.description ?? "");
                setStartDateTime(data.startDateTime ?? "");
                setDueDateTime(data.dueDateTime ?? "");
                setLocation(data.location ?? "");
            } else {
                console.error('Failed to fetch event');
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTags();
            if (id) {
                fetchEvent(id);
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

    const handleStartDateTimeChange = (value: string): void => {
        setStartDateTime(value);
        const start = new Date(value);
        const due = addHours(start, 1);
        const formattedDueDateTime = format(due, 'yyyy-MM-dd\'T\'HH:00');
        setDueDateTime(formattedDueDateTime);
        setDateError(''); // Clear error when start date changes
    };

    const handleDueDateTimeChange = (value: string): void => {
        const dueDate = new Date(value);
        const startDate = new Date(startDateTime);
        if (isBefore(dueDate, startDate)) {
            setDateError('Due date cannot be before start date.');
        } else {
            setDueDateTime(value);
            setDateError(''); // Clear error if the due date is valid
        }
    };

    const handleHashtagKeyPress = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
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

    const addHashtagToList = (hashtag: HashtagResponse): void => {
        setHashtags((prev) => [...prev, hashtag]);
        setHashtagIds((prev) => [...prev, hashtag.id]);
    };

    const handleSave = async (): Promise<void> => {
        if (title && startDateTime && dueDateTime && !dateError) {
            const formattedStartDateTime = TimeUtil.dateToString(new Date(startDateTime));
            const formattedDueDateTime = TimeUtil.dateToString(new Date(dueDateTime));

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
                        refetchEvents();
                        onClose();
                    } else {
                        console.error('Failed to update event');
                    }
                } else {
                    const response = await createEvent(eventPayload);
                    if (response.status === 200) {
                        refetchEvents();
                        onClose();
                    } else {
                        console.error('Failed to create event');
                    }
                }
            } catch (error) {
                console.error('Error saving event:', error);
            }
        } else {
            console.error('Missing required fields or invalid dates');
        }
    };

    const handleClose = (): void => {
        refetchEvents();
        onClose();
    };

    if (!isOpen) return null;

    const handleDelete = async (): Promise<void> => {
        if (id) {
            try {
                const response = await deleteEvent(id);
                if (response.status === 200) {
                    refetchEvents();
                    onClose();
                } else {
                    console.error('Failed to delete event');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        } else {
            console.error('Missing required id');
        }
    };
    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box">
                {loading ? (
                    <div>Loading...</div>
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

                            {/* Display error message if dates are invalid */}
                            {dateError && <div className="text-red-500 text-sm">{dateError}</div>}

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
                            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default EventModal;
