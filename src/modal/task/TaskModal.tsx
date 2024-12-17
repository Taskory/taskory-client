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
    const [id, setId] = useState<number | null>(selectedTaskId);
    const [title, setTitle] = useState<string>("");
    const [event, setEvent] = useState<EventSummary | null>(null);
    const [tag, setTag] = useState<TagResponse>(tagOptions[0]);
    const [hashtags, setHashtags] = useState<HashtagResponse[]>([]);
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<TaskStatus>(selectedStatus)
    const [taskItems, setTaskItems] = useState<TaskItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Tracks loading state
    const [upcomingEvents, setUpcomingEvents] = useState<EventSummary[]>([]);

    /* Fetch Task - Retrieves task details if editing */
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
        } catch (e) {
            console.error('Failed to fetch task:', e); // Error handling for failed fetch
        } finally {
            setIsLoading(false); // Ensure loading spinner stops
        }
    }, []);

    /* Save Task - Handles creation or update of a task */
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
                item.id && item.id < 0 ? { ...item, id: null } : item // Ensure valid IDs for new items
            ),
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
    }, [title, event?.id, tag?.id, hashtags, description, status, taskItems, id, closeTaskModal]);

    /* Delete Task - Deletes an existing task */
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


    /* Fetch for get upcoming events */
    const fetchUpcomingEvents =  async () => {
        const res = await request_getUpcomingEvents(TimeUtil.dateToString(new Date()));
        setUpcomingEvents(res);
    }

    /* Loading Spinner */
    const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner"></span>
        </div>
    );

    /* Render Status Options - Dynamically render task statuses */
    const renderStatusOptions = useCallback(
        (statuses: { value: TaskStatus; label: string }[]) =>
            statuses.map(({ value, label }) => (
                <label key={value} className="cursor-pointer flex-1">
                    <input
                        type="radio"
                        name="status"
                        className="hidden"
                        value={value}
                        checked={status === value}
                        onChange={() => setStatus(value)}
                    />
                    <div
                        className={`w-full text-center py-2 border-2 rounded-lg text-sm transition-colors ${
                            status === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {label}
                    </div>
                </label>
            )),
        [status]
    );

    const handleSelectEvent = (event: EventSummary | null) => {
        setEvent(event);
        if (event) setTag(event.tag);
    }



    /* Status Options Array */
    const statusOptions = [
        { value: TaskStatus.BACKLOG, label: 'BACKLOG' },
        { value: TaskStatus.TODO, label: 'TO DO' },
        { value: TaskStatus.PROGRESS, label: 'IN PROGRESS' },
        { value: TaskStatus.DONE, label: 'DONE' },
    ];

    /* On Modal Open - Fetch task details if editing */
    useEffect(() => {
        if (isModalOpen && selectedTaskId) {
            fetchTask(selectedTaskId);
        }
    }, [isModalOpen, selectedTaskId, fetchTask]);

    /* On Modal Open - Fetch upcoming events */
    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

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
                                <div className="col-span-1">
                                    {/* Tag Selector */}
                                    <TagSelectBox
                                        list={tagOptions}
                                        tagState={tag}
                                        setTagState={(value) => setTag(value)}
                                    />
                                </div>
                                {/* Status Selector */}
                                <label className="col-span-1 text-sm text-right mt-2">Status</label>
                                <div className="col-span-3 flex space-x-2">
                                    {renderStatusOptions(statusOptions)}
                                </div>
                                {/* Event Selector */}
                                <label className="col-span-1 text-sm text-right mt-2">Event</label>
                                <div className="col-span-3 flex space-x-2">
                                    <EventSelectBox eventList={upcomingEvents} event={event} setEvent={handleSelectEvent} />
                                </div>
                                {/* Description Input */}
                                <label className="col-span-1 text-sm text-right mt-2">Description</label>
                                <textarea
                                    className="col-span-3 textarea textarea-bordered textarea-sm w-full resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Enter Task Description"
                                />
                                {/* Task Items Section */}
                                <TaskItemSection items={taskItems} setItems={setTaskItems}/>
                            </div>
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
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};
