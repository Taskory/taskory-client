import React, { useState, useEffect, KeyboardEvent } from 'react';
import { API_URL } from "../../constants";
import { format, addHours } from 'date-fns';
import { getAllTags } from "../../api/tag/TagApi";
import { createEvent, getEventById, updateEvent } from "../../api/event/EventApi";
import { SaveEventRequest, EventResponse } from "../../api/event/EventsTypes";
import { TagResponse } from "../../api/tag/TagTypes";
import timezones from '../../constants/timezones.json';
import {requestZoneid} from "../../api/UserApi"; // Import the timezones from JSON

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    refetchEvents: () => void;
}

interface HashtagResponse {
    id: number;
    name: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, id, refetchEvents }) => {
    // State management for the form fields
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
    const [timezone, setTimezone] = useState('UTC'); // Default timezone state
    const [loading, setLoading] = useState(false);

    // Fetches the available tags for the tag dropdown
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

    const fetchTimezone = async (): Promise<void> => {
        try {
            // Call the requestZoneid function, which returns a plain string
            const timezone = await requestZoneid();

            if (timezone) {
                // Set the fetched timezone
                setTimezone(timezone);
            } else {
                console.error('Failed to fetch timezone');
            }
        } catch (error) {
            console.error("Error fetching timezone:", error);
        }
    };


    // Fetches the event details if the modal is opened for editing
    const fetchEvent = async (eventId: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await getEventById(eventId);
            if (response.status === 200) {
                const data: EventResponse = response.data;
                // Populate the state with the fetched event data
                setTitle(data.title ?? "");
                setTagId(data.tag?.id ?? undefined);
                setHashtags(data.hashtags ?? []);
                setHashtagIds(data.hashtags ? data.hashtags.map((hashtag) => hashtag.id) : []);
                setDescription(data.description ?? "");
                setStartDateTime(data.startDateTime ?? "");
                setDueDateTime(data.dueDateTime ?? "");
                setLocation(data.location ?? "");
                setTimezone(data.timezone ?? 'UTC'); // Default to UTC if no timezone is set
            } else {
                console.error('Failed to fetch event');
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hook to fetch initial data when the modal is opened
    useEffect(() => {
        if (isOpen) {
            fetchTags();
            if (id) {
                fetchEvent(id); // Fetch event if editing an existing one
            } else {
                const now = new Date();
                const oneHourLater = addHours(now, 1);
                const formattedStartDateTime = format(oneHourLater, 'yyyy-MM-dd\'T\'HH:00');
                setStartDateTime(formattedStartDateTime);

                const twoHoursLater = addHours(now, 2);
                const formattedDueDateTime = format(twoHoursLater, 'yyyy-MM-dd\'T\'HH:00');
                setDueDateTime(formattedDueDateTime);

                fetchTimezone();
            }
        }
    }, [isOpen, id]);

    // Handles the start date change and auto-calculates the due date
    const handleStartDateTimeChange = (value: string): void => {
        setStartDateTime(value);
        const start = new Date(value);
        const due = addHours(start, 1);
        const formattedDueDateTime = format(due, 'yyyy-MM-dd\'T\'HH:00');
        setDueDateTime(formattedDueDateTime);
    };

    const handleDueDateTimeChange = (value: string): void => {
        setDueDateTime(value);
    };

    // Handles adding a hashtag when the "Enter" key is pressed
    const handleHashtagKeyPress = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter' && hashtagTitle.trim() !== '') {
            event.preventDefault();
            try {
                const response = await fetch(`${API_URL}/hashtags?title=${hashtagTitle}`);
                if (response.ok) {
                    const hashtagData: HashtagResponse = await response.json();
                    addHashtagToList(hashtagData);
                } else if (response.status === 404) {
                    // Create new hashtag if it doesn't exist
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
                setHashtagTitle(''); // Clear the input field
            }
        }
    };

    // Adds a hashtag to the current list of hashtags
    const addHashtagToList = (hashtag: HashtagResponse): void => {
        setHashtags((prev) => [...prev, hashtag]);
        setHashtagIds((prev) => [...prev, hashtag.id]);
    };

    // Handles the save button functionality for creating/updating events
    const handleSave = async (): Promise<void> => {
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
                timezone, // Include timezone in the event payload
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
            console.error('Missing required fields: title, startDateTime, or dueDateTime');
        }
    };

    // Handles closing the modal and triggers refetching events
    const handleClose = (): void => {
        refetchEvents();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <h3 className="font-bold text-lg">{id ? 'Edit Event' : 'Create New Event'}</h3>
                        <div className="py-4 space-y-4">
                            {/* Event title input */}
                            <div className="flex items-center">
                                <label className="w-1/3">Event Title:</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Tag dropdown */}
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

                            {/* Timezone dropdown */}
                            <div className="flex items-center">
                                <label className="w-1/3">Timezone:</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                >
                                    {Object.entries(timezones.timezone).map(([label, tz]) => (
                                        <option key={tz} value={tz}>
                                            {label} ({tz})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hashtags input */}
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

                            {/* List of selected hashtags */}
                            <div className="mt-2">
                                {hashtags.map(hashtag => (
                                    <span key={hashtag.id} className="badge badge-secondary m-1">
                                        #{hashtag.name}
                                    </span>
                                ))}
                            </div>

                            {/* Description input */}
                            <div className="flex items-center">
                                <label className="w-1/3">Description:</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Start date input */}
                            <div className="flex items-center">
                                <label className="w-1/3">Start Date:</label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    value={startDateTime}
                                    onChange={(e) => handleStartDateTimeChange(e.target.value)}
                                />
                            </div>

                            {/* Due date input */}
                            <div className="flex items-center">
                                <label className="w-1/3">Due Date:</label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    value={dueDateTime}
                                    onChange={(e) => handleDueDateTimeChange(e.target.value)}
                                />
                            </div>

                            {/* Location input */}
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

                        {/* Save and Cancel buttons */}
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
