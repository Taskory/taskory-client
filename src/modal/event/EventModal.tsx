import React, {useState, useEffect, KeyboardEvent, useCallback} from 'react';
import { API_URL } from "../../constants";
import { format, addHours, isBefore } from 'date-fns';
import { request_createEvent, request_getEventById, request_updateEvent } from "../../api/event/EventApi";
import {SaveEventRequest, EventResponse, TaskInEventDto} from "../../api/event/EventsTypes";
import { TimeUtil } from "../../util/TimeUtil";
import { HashtagResponse } from "../../api/hashtag/HashtagTypes";
import {useEventModal} from "../context/EventModalContext";
import { TagSelectBox } from '../../component/TagSelectBox';
import {useTagContext} from "../../context/data/TagContext";
import {TagResponse} from "../../api/tag/TagTypes";
import {useEventContext} from "../../context/data/EventContext";
import {EventDeleteWarningModal} from "./EventDeleteWarningModal";
import {TaskSection} from "./TaskSection";
import {useTaskContext} from "../../context/data/TaskContext";

export const EventModal: React.FC = () => {
	/* Context */
	const {fetchOriginEvents} = useEventContext();
	const {userTags} = useTagContext();
	const {isModalOpen, closeEventModal, selectedEventId} = useEventModal();
	const {fetchOriginTasks} = useTaskContext();

	/* useState */
	const [title, setTitle] = useState('');
	const [tag, setTag] = useState<TagResponse>(userTags[0]);
	const [hashtagTitle, setHashtagTitle] = useState('');
	const [hashtagIds, setHashtagIds] = useState<number[]>([]);
	const [hashtags, setHashtags] = useState<HashtagResponse[]>([]);
	const [description, setDescription] = useState('');
	const [startDateTime, setStartDateTime] = useState('');
	const [dueDateTime, setDueDateTime] = useState('');
	const [location, setLocation] = useState('');
	const [loading, setLoading] = useState(false);
	const [dateError, setDateError] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [savedTasks, setSavedTasks] = useState<TaskInEventDto[]>([]);

	/* useCallback */
	const handleSave = useCallback(async (): Promise<void> => {
		if (title && startDateTime && dueDateTime && !dateError) {
			const formattedStartDateTime = TimeUtil.dateTimeToString(new Date(startDateTime));
			const formattedDueDateTime = TimeUtil.dateTimeToString(new Date(dueDateTime));
			const eventPayload: SaveEventRequest = {
				title,
				tagId: tag?.id,
				tasks: savedTasks.map((task) =>
					task.id && task.id < 0 ? {...task, id: null} : task),
				hashtagIds,
				description,
				startDateTime: formattedStartDateTime,
				dueDateTime: formattedDueDateTime,
				location,
			};

			try {
				if (selectedEventId) {
					const response = await request_updateEvent(selectedEventId, eventPayload);
					if (response.status === 200) {
						await fetchOriginEvents();
						closeEventModal();
					} else {
						console.error('Failed to update event');
					}
				} else {
					const response = await request_createEvent(eventPayload);
					if (response.status === 200) {
						await fetchOriginEvents();
						closeEventModal();
					} else {
						console.error('Failed to create event');
					}
				}
				fetchOriginTasks();
			} catch (error) {
				console.error('Error saving event:', error);
			}

		} else {
			console.error('Missing required fields or invalid dates');
		}
	}, [closeEventModal, dateError, description, dueDateTime, fetchOriginEvents, fetchOriginTasks, hashtagIds, location, savedTasks, selectedEventId, startDateTime, tag?.id, title]);

	const handleClose = useCallback(async (): Promise<void> => {
		await fetchOriginEvents();
		closeEventModal();
	}, [closeEventModal, fetchOriginEvents]);


	/* useEffect */
	useEffect(() => {
		if (isModalOpen) {
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

	useEffect(() => {
		const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
			if (
				['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName) ||
				event.target instanceof HTMLInputElement
			) {
				// Prevent Enter key from interfering in input fields
				return;
			}

			if (event.key === 'Enter') {
				handleSave();
			} else if (event.key === 'Escape') {
				handleClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleSave, handleClose]);


	/* functions */
	const fetchEvent = async (eventId: number): Promise<void> => {
		setLoading(true);
		try {
			const response = await request_getEventById(eventId);
			if (response.status === 200) {
				const data: EventResponse = response.data;
				setTitle(data.title ?? "");
				setTag(data.tag)
				setSavedTasks(data.tasks);
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
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({title: hashtagTitle}),
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


	if (!isModalOpen) return null;

	return (
		<>
			<dialog open={isModalOpen} className="modal modal-open max-h-screen max-w-screen">
				<div className="modal-box max-w-md p-2">
					{loading ? (
						<div className="flex justify-center items-center h-32">
							<span className="loading loading-spinner"></span>
						</div>
					) : (
						<>
							<div className="grid grid-cols-4">  {/* Updated: Create a 2-column grid layout */}
								{/* Title and Tag */}
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
									<TagSelectBox list={userTags} tagState={tag} setTagState={setTag}/>
								</div>
								{/* Date time*/}
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
								<div className="col-span-4">
									{dateError && (
										<div className="col-span-3 text-red-500 text-xs">
											{dateError}
										</div>
									)}
								</div>
								{/* Hashtags */}
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
                                                    #{hashtag.title}
                                                </span>
											))}
										</div>
									</div>
								</div>
								{/* Location */}
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
								{/* Description */}
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
								<TaskSection items={savedTasks} setItems={setSavedTasks}/>
							</div>
							<div className="flex gap-2 justify-end">
								<button className="btn btn-primary btn-sm" onClick={handleSave}>
									{selectedEventId ? 'Update' : 'Save'}
								</button>
								{selectedEventId && (
									<button className="btn btn-error btn-sm"
									        onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
								)}
								<button className="btn btn-outline btn-sm" onClick={handleClose}>Cancel</button>
							</div>
						</>
					)}
				</div>
			</dialog>
			{selectedEventId && isDeleteModalOpen && (
				<EventDeleteWarningModal
					event={{
						id: selectedEventId,
						title,
						tag: {
							id: tag.id,
							title: tag.title,
							color: tag.color
						},
						startDateTime,
						dueDateTime,
					}}
					isModalOpen={isDeleteModalOpen}
					closeDeleteModal={() => setIsDeleteModalOpen(false)}
				/>
			)}
		</>
	);
};