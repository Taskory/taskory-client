// TaskModal.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTaskModal} from "../context/TaskModalContext";
import {request_createTask, request_deleteTask, request_getTaskById, request_updateTask} from "../../api/task/TaskApi";
import {SaveTaskRequest, TaskItemDto, TaskResponse, TaskStatus} from "../../api/task/TaskTypes";
import {TagSelectBox} from '../../component/TagSelectBox';
import {useTagContext} from "../../context/data/TagContext";
import {EventSummary} from "../../api/event/EventsTypes";
import {TagResponse} from "../../api/tag/TagTypes";
import {HashtagResponse} from "../../api/hashtag/HashtagTypes";
import {TaskItemSection} from "./TaskItemSection";
import {request_getUpcomingEvents} from "../../api/event/EventApi";
import {TimeUtil} from "../../util/TimeUtil";
import {EventSelectBox} from './EventSelectBox';
import {getSelectedStatusStyle, getUnselectedStatusStyle} from "../../component/StatusBadge";

interface TaskModalProps {
	selectedStatus: TaskStatus; // Preselected status for the modal
}


export const TaskModal: React.FC<TaskModalProps> = ({ selectedStatus }) => {
	/* Contexts to manage modal state and user tags */
	const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
	const { userTags } = useTagContext();

	// Memoize tag options to avoid unnecessary re-renders
	const tagOptions = useMemo(() => userTags, [userTags]);

	/* State management */
	// Task information =====
	const [id, setId] = useState<number | null>(selectedTaskId);
	const [title, setTitle] = useState<string>("");
	const [event, setEvent] = useState<EventSummary | null>(null);
	const [tag, setTag] = useState<TagResponse>(tagOptions[0]);
	const [hashtags, setHashtags] = useState<HashtagResponse[]>([]);
	const [description, setDescription] = useState<string>("");
	const [status, setStatus] = useState<TaskStatus>(selectedStatus)
	const [taskItems, setTaskItems] = useState<TaskItemDto[]>([]);
	const [deadline, setDeadline] = useState<string>("");
	// =======================
	const [isLoading, setIsLoading] = useState(false); // Tracks loading state
	const [upcomingEvents, setUpcomingEvents] = useState<EventSummary[]>([]);
	const [daysLeftDeadline, setDaysLeftDeadline] = useState<number>(0);
	const [dateError, setDateError] = useState<string>("");

	/* UseCallback */
	 // Fetch Task - Retrieves task details if editing
	const fetchTask = useCallback(async (taskId: number): Promise<void> => {
		setIsLoading(true);
		try {
			const response: TaskResponse = await request_getTaskById(taskId);
			setId(response.id);
			setTitle(response.title);
			setEvent(response.event);
			setTag(response.tag);
			setHashtags(response.hashtags);
			setDescription(response.description);
			setStatus(response.status as TaskStatus);
			setTaskItems(response.items);
			// if (response.deadline) {           TODO: uncomment, remove underline
			// 	setDeadline(response.deadline);
			// } else {
			// 	setDeadline("");
			// }
			const tempDate = new Date();
			const tempDeadlineDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 5);
			setDeadline(TimeUtil.dateToString(tempDeadlineDate));
		} catch (e) {
			console.error('Failed to fetch task:', e); // Error handling for failed fetch
		} finally {
			setIsLoading(false); // Ensure loading spinner stops
		}
	}, []);

	 // Save Task - Handles creation or update of a task
	const handleSave = useCallback(async () => {
		setIsLoading(true);
		const saveTaskRequest: SaveTaskRequest = {
			title: title,
			eventId: event?.id ?? null,
			tagId: tag?.id ?? null,
			hashtagIds: hashtags.map((hashtag) => hashtag.id),
			description: description,
			status: status,
			items: taskItems.map((item) =>
				item.id && item.id < 0 ? {...item, id: null} : item // Ensure valid IDs for new items
			),
			deadline: deadline,
		};

		try {
			if (id) {
				// Update if task exists
				await request_updateTask(id, saveTaskRequest);
			} else {
				// Create new task if none exists
				await request_createTask(saveTaskRequest);
			}
			closeTaskModal(); // Close modal on success
		} catch (error) {
			console.error('Error saving task:', error); // Error handling for saving
		} finally {
			setIsLoading(false);
		}
	}, [title, event?.id, tag?.id, hashtags, description, status, taskItems, deadline, id, closeTaskModal]);

	 // Delete Task - Deletes an existing task
	const handleDelete = useCallback(async () => {
		if (selectedTaskId) {
			try {
				await request_deleteTask(selectedTaskId);
				closeTaskModal(); // Close modal after deletion
			} catch (error) {
				console.error('Error deleting task:', error); // Error handling for deletion
			}
		}
	}, [selectedTaskId, closeTaskModal]);

	/* UseEffect */
	// On Modal Open - Fetch task details if editing
	useEffect(() => {
		if (isModalOpen && selectedTaskId) {
			fetchTask(selectedTaskId);
		}
	}, [isModalOpen, selectedTaskId, fetchTask]);

	// On Modal Open - Fetch upcoming events
	useEffect(() => {
		fetchUpcomingEvents();
	}, []);

	useEffect(() => {
		const calculateDaysLeft = () => {
			if (deadline.length > 0) {
				try {
					const deadlineDate = TimeUtil.stringToDate(deadline);
					const now = new Date();

					// Calculate the difference in milliseconds
					const diffInMilliseconds = deadlineDate.getTime() - now.getTime();

					// Convert to days and round up
					const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

					setDaysLeftDeadline(diffInDays);
				} catch (error) {
					console.error('Invalid deadline date format:', error);
					setDaysLeftDeadline(0); // Reset the state on error
				}
			}
		};
		calculateDaysLeft();
	}, [deadline]);

	useEffect(() => {
		if (event) {
			try {
				const deadlineDateTime: Date = TimeUtil.stringToDate(deadline);
				deadlineDateTime.setHours(23, 59, 0, 0); // Set to end of day

				const eventDueDate: Date = TimeUtil.stringToDateTime(event.dueDateTime);
				eventDueDate.setHours(23, 59, 0, 0);

				if (deadlineDateTime > eventDueDate) {
					setDateError("Deadline must be before event due date");
				} else {
					setDateError(""); // Clear error if condition is satisfied
				}
			} catch (error) {
				console.error("Invalid date format:", error);
				setDateError("Invalid deadline format");
			}
		} else {
			setDateError(""); // Clear any previous errors if there's no event
		}
	}, [deadline, event]);

	/* Fetch for get upcoming events */
	const fetchUpcomingEvents =  async () => {
		const res = await request_getUpcomingEvents(TimeUtil.dateTimeToString(new Date()));
		setUpcomingEvents(res);
	}

	/* Loading Spinner */
	const LoadingSpinner = () => (
		<div className="flex justify-center items-center h-32">
			<span className="loading loading-spinner"></span>
		</div>
	);


	const handleSelectEvent = (event: EventSummary | null) => {
		setEvent(event);
		if (event) setTag(event.tag);
	}

	const handleDeadline = (value: string): void => {
		setDeadline(value); // Always update the deadline state
	};


	 // Render Status Options            TODO: if status is TODO, update deadline
	const renderStatusOptions = useCallback(() => {
	    const statusList = Object.values(TaskStatus);
	    return (
	        <>
	            {statusList.map((item) => (
	                < label key={item} className="cursor-pointer flex-1">
	                    <input
	                        type="radio"
	                        name="status"
	                        className="hidden"
	                        value={item}
	                        checked={status === item}
	                        onChange={() => setStatus(item)}
	                    />
	                    <div
	                        className={`w-full text-center py-2 border-2 rounded-lg text-xs font-bold transition-colors items-center
	                                                ${status === item ? getSelectedStatusStyle(item) : getUnselectedStatusStyle(item)}`}
	                    >
	                        {item}
	                    </div>
	                </label>
	            ))}
	        </>
	    );
	}, [status]);


	/* Modal Render */
	return (
		<div
			className={`fixed inset-0 z-50 ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}
		>
			<dialog open={isModalOpen} className="modal max-h-screen max-w-screen">
				<div className="modal-box max-w-lg p-6 rounded-lg shadow-xl">
					{isLoading ? (
						<LoadingSpinner/>
					) : (
						<form
							onSubmit={(e) => {
								e.preventDefault(); // Prevent form default behavior
								handleSave();
							}}
						>
							<div className="grid grid-cols-4 gap-4">

								{/* ===== */}
								{/* Title Input */}
								<div className="col-span-3">
									<input
										type="text"
										className="input input-ghost w-full text-lg font-semibold border-b-2 focus:outline-none focus:border-blue-500"
										value={title}
										placeholder="Enter Task Title"
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>

								{/* Tag Selector */}
								<div className="col-span-1 flex items-center">
									<TagSelectBox
										list={tagOptions}
										tagState={tag}
										setTagState={(value) => setTag(value)}
									/>
								</div>
								{/* ===== */}

								{/* ===== */}
								{/* Status Selector */}
								<label className="col-span-1 text-sm text-right mt-2">Status</label>
								<div className="col-span-3 flex space-x-2">
									{renderStatusOptions()}
								</div>
								{/* ===== */}

								{/* ===== */}
								{/* Deadline */}
								<label className="col-span-1 text-sm text-right mt-2">Deadline</label>
								<div className="col-span-3 flex items-center space-x-4">
									<div className="relative">
										<input
											type="date"
											className="input input-bordered input-sm w-36"
											value={deadline}
											onChange={(e) => handleDeadline(e.target.value)}
										/>
									</div>
									<div
										className={`text-sm font-semibold ${
											daysLeftDeadline && daysLeftDeadline < 0
												? 'text-red-500'
												: 'text-gray-700'
										}`}
									>
										{deadline
											? daysLeftDeadline < 0
												? `Overdue by ${Math.abs(daysLeftDeadline)} days`
												: `${daysLeftDeadline} days remaining`
											: 'No deadline set'}
									</div>
								</div>
								{dateError && (
									<>
										<div className="col-span-1"/>
										<div className="col-span-3 flex items-center space-x-4">

											<div className="col-span-3 text-red-500 text-xs">
												{dateError}
											</div>

										</div>
									</>
								)}
								{/* ===== */}

								{/* ===== */}
								{/* Event Selector */}
								<label className="col-span-1 text-sm text-right mt-2">Event</label>
								<div className="col-span-3 flex space-x-2">
									<EventSelectBox eventList={upcomingEvents} event={event} setEvent={handleSelectEvent}/>
								</div>
								{/* ===== */}

								{/* ===== */}
								{/* Description Input */}
								<label className="col-span-1 text-sm text-right mt-2">Description</label>
								<textarea
									className="col-span-3 textarea textarea-bordered textarea-sm w-full resize-none"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
									placeholder="Enter Task Description"
								/>
								{/* ===== */}

								{/* ===== */}
								{/* Task Items Section */}
								<TaskItemSection items={taskItems} setItems={setTaskItems}/>
								{/* ===== */}
							</div>


							{/* ===== */}
							{/* Action Buttons */}
							<div className="flex gap-4 justify-end mt-6">
								<button type="submit" className="btn btn-primary">
									{selectedTaskId ? 'Update' : 'Save'}
								</button>
								{selectedTaskId && (
									<button type="button" className="btn btn-error" onClick={handleDelete}>
										Delete
									</button>
								)}
								<button type="button" className="btn btn-outline" onClick={closeTaskModal}>
									Cancel
								</button>
							</div>
							{/* ===== */}
						</form>
					)}
				</div>
			</dialog>
		</div>
	);
};
