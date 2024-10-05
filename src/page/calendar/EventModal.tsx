import React, { useState, useEffect, KeyboardEvent } from 'react';
import { API_URL } from "../../constants";
import { format, addHours, isBefore } from 'date-fns';
import { getAllTags } from "../../api/tag/TagApi";
import { createEvent, deleteEvent, getEventById, updateEvent } from "../../api/event/EventApi";
import { SaveEventRequest, EventResponse } from "../../api/event/EventsTypes";
import { TagResponse } from "../../api/tag/TagTypes";
import { TimeUtil } from "../../util/TimeUtil";
import { HashtagResponse } from "../../api/hashtag/HashtagTypes";
import {useCalendar} from "./context/CalendarContext";
import {useEventModal} from "./context/EventModalContext";

const EventModal: React.FC = () => {
    const {isModalOpen, closeEventModal, selectedEventId} = useEventModal();
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
    const [dateError, setDateError] = useState('');
    const {refetchEvents} = useCalendar();

    useEffect(() => {
        if (isModalOpen) {
            fetchTags();
            if (selectedEventId) {
                fetchEvent(selectedEventId);
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
    }, [isModalOpen, selectedEventId]);

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

    const handleStartDateTimeChange = (value: string): void => {
        setStartDateTime(value);
        const start = new Date(value);
        const due = addHours(start, 1);
        const formattedDueDateTime = format(due, 'yyyy-MM-dd\'T\'HH:00');
        setDueDateTime(formattedDueDateTime);
        setDateError('');
    };

    const handleDueDateTimeChange = (value: string): void => {
        const dueDate = new Date(value);
        const startDate = new Date(startDateTime);
        if (isBefore(dueDate, startDate)) {
            setDateError('Due date cannot be before start date.');
        } else {
            setDueDateTime(value);
            setDateError('');
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
                if (selectedEventId) {
                    const response = await updateEvent(selectedEventId, eventPayload);
                    if (response.status === 200) {
                        console.log('Event successfully updated');
                        refetchEvents();
                        closeEventModal();
                    } else {
                        console.error('Failed to update event');
                    }
                } else {
                    const response = await createEvent(eventPayload);
                    if (response.status === 200) {
                        refetchEvents();
                        closeEventModal();
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
        closeEventModal();
    };

    const handleDelete = async (): Promise<void> => {
        if (selectedEventId) {
            try {
                const response = await deleteEvent(selectedEventId);
                if (response.status === 200) {
                    refetchEvents();
                    closeEventModal();
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

    if (!isModalOpen) return null;

    return (
        <dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
            <div className="modal-box max-w-md p-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-4">  {/* Updated: Create a 2-column grid layout */}
                            <div className="col-span-3 py-2">
                                <input
                                    type="text"
                                    className="input input-ghost w-full font-bold"
                                    value={title}
                                    placeholder={"Type a title"}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 content-center">
                                <div className={"flex items-center"}>
                                    {/* apply color*/}
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
                                <label className="label text-sm justify-end mr-1">Date & Time</label>
                            </div>
                            <div className="col-span-3 space-y-1 py-1">
                                <input
                                    type="datetime-local"
                                    className="input input-bordered input-sm w-full"
                                    value={startDateTime}
                                    onChange={(e) => handleStartDateTimeChange(e.target.value)}
                                />
                                <input
                                    type="datetime-local"
                                    className="input input-bordered input-sm w-full"
                                    value={dueDateTime}
                                    onChange={(e) => handleDueDateTimeChange(e.target.value)}
                                />
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
                                        {hashtags.map(hashtag => (
                                            <span key={hashtag.id} className="badge badge-secondary m-1">
                                    #{hashtag.name}
                                </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4">

                                {dateError && (
                                    <div className="col-span-3 text-red-500 text-xs">
                                        {dateError}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-1">

                                <label className="label text-sm justify-end mr-1">Location</label>
                            </div>
                            <div className="col-span-3">

                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
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
                                {selectedEventId ? 'Update' : 'Save'}
                            </button>
                            {selectedEventId && (
                                <button className="btn btn-error btn-sm" onClick={handleDelete}>Delete</button>
                            )}
                            <button className="btn btn-outline btn-sm" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default EventModal;
