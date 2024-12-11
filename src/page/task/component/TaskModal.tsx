// TaskModal.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTaskModal} from "../../../context/modal/TaskModalContext";
import {
    request_createTask,
    request_deleteTask,
    request_getTaskById,
    request_updateTask
} from "../../../api/task/TaskApi";
import {SaveTaskRequest, TaskItemDto, TaskResponse, TaskStatus} from "../../../api/task/TaskTypes";
import {TagSelectBox} from '../../../component/TagSelectBox';
import {useTagContext} from "../../../context/data/TagContext";
import {EventSummary} from "../../../api/event/EventsTypes";
import {TagResponse} from "../../../api/tag/TagTypes";
import {HashtagResponse} from "../../../api/hashtag/HashtagTypes";
import {TaskItemSection} from "./TaskItemSection";
import {request_getUpcomingEvents} from "../../../api/event/EventApi";
import {TimeUtil} from "../../../util/TimeUtil";
import { EventSelectBox } from '../../../component/EventSelectBox';

interface TaskModalProps {
    selectedStatus: TaskStatus; // Preselected status for the modal
}

type TaskModalState = {
    id: number | null; // Holds the current task's ID or null for new tasks
    title: string; // Title of the task
    event: EventSummary | null; // Associated event or null if none
    tag: TagResponse; // Selected tag
    hashtags: HashtagResponse[]; // List of hashtags for the task
    description: string; // Task description
    status: string; // Task status (BACKLOG, TODO, etc.)
};

export const TaskModal: React.FC<TaskModalProps> = ({ selectedStatus }) => {
    /* Contexts to manage modal state and user tags */
    const { isModalOpen, selectedTaskId, closeTaskModal } = useTaskModal();
    const { userTags } = useTagContext();

    // Memoize tag options to avoid unnecessary re-renders
    const tagOptions = useMemo(() => userTags, [userTags]);

    /* State management */
    const [task, setTask] = useState<TaskModalState>({
        id: null,
        title: '',
        event: null,
        tag: tagOptions[0],
        hashtags: [],
        description: '',
        status: selectedStatus, // Initialize status with the preselected value
    });
    const [taskItems, setTaskItems] = useState<TaskItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Tracks loading state
    const [upcomingEvents, setUpcomingEvents] = useState<EventSummary[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);

    /* Fetch Task - Retrieves task details if editing */
    const fetchTask = useCallback(async (taskId: number): Promise<void> => {
        setIsLoading(true);
        try {
            const response: TaskResponse = await request_getTaskById(taskId);
            setTask({
                id: response.id,
                title: response.title,
                event: response.event ?? null,
                tag: response.tag,
                hashtags: response.hashtags,
                description: response.description,
                status: response.status as TaskStatus,
            });
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
            title: task.title,
            eventId: selectedEvent?.id ?? null,
            tagId: task.tag?.id ?? null,
            hashtagIds: task.hashtags.map((hashtag) => hashtag.id),
            description: task.description,
            status: task.status,
            items: taskItems.map((item) =>
                item.id && item.id < 0 ? { ...item, id: null } : item // Ensure valid IDs for new items
            ),
        };

        try {
            if (selectedTaskId) {
                // Update if task exists
                await request_updateTask(selectedTaskId, saveTaskRequest);
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
    }, [selectedEvent, task, selectedTaskId, taskItems, closeTaskModal]);

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
                        checked={task.status === value}
                        onChange={() => setTask({ ...task, status: value })}
                    />
                    <div
                        className={`w-full text-center py-2 border-2 rounded-lg text-sm transition-colors ${
                            task.status === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {label}
                    </div>
                </label>
            )),
        [task]
    );

    /* Status Options Array */
    const statusOptions = [
        { value: TaskStatus.BACKLOG, label: 'BACKLOG' },
        { value: TaskStatus.TODO, label: 'To Do' },
        { value: TaskStatus.PROGRESS, label: 'In Progress' },
        { value: TaskStatus.DONE, label: 'Done' },
    ];

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
                                        value={task.title}
                                        placeholder="Enter Task Title"
                                        onChange={(e) => setTask({...task, title: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1">
                                    {/* Tag Selector */}
                                    <TagSelectBox
                                        list={tagOptions}
                                        tagState={task.tag}
                                        setTagState={(valueOrUpdater) =>
                                            setTask((prevTask) =>
                                                typeof valueOrUpdater === 'function'
                                                    ? {...prevTask, tag: valueOrUpdater(prevTask.tag)}
                                                    : {...prevTask, tag: valueOrUpdater}
                                            )
                                        }
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
                                    <EventSelectBox eventList={upcomingEvents} event={selectedEvent} setEvent={setSelectedEvent} />
                                </div>
                                {/* Description Input */}
                                <label className="col-span-1 text-sm text-right mt-2">Description</label>
                                <textarea
                                    className="col-span-3 textarea textarea-bordered textarea-sm w-full resize-none"
                                    value={task.description}
                                    onChange={(e) => setTask({...task, description: e.target.value})}
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
