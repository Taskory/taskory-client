import React, { useCallback, useEffect, useState } from "react";
import { useEventContext } from "../../context/data/EventContext";
import { useTaskContext } from "../../context/data/TaskContext";
import {request_deleteEvent } from "../../api/event/EventApi";
import {request_getTasksByEvent } from "../../api/task/TaskApi";
import { EventSummary } from "../../api/event/EventsTypes";
import { TaskSummary } from "../../api/task/TaskTypes";
import { EventOption } from "../../component/EventOption";
import { TaskOption } from "../../component/TaskOption";
import {useEventModal} from "../context/EventModalContext";

interface EventDeleteWarningModalProps {
    event: EventSummary;
    isModalOpen: boolean;
    closeDeleteModal: () => void;
}

export const EventDeleteWarningModal: React.FC<EventDeleteWarningModalProps> = ({
                                                                                event,
                                                                                isModalOpen,
                                                                                closeDeleteModal,
                                                                            }) => {
    /* Context */
    const {closeEventModal} = useEventModal();
    const { fetchOriginEvents } = useEventContext();
    const { fetchOriginTasks } = useTaskContext();

    /* Management state*/
    const [tasks, setTasks] = useState<TaskSummary[]>([]);

    /* Functions */
    const deleteEvent = async (): Promise<void> => {
            try {
                const response = await request_deleteEvent(event.id);
                if (response.status === 200) {
                    fetchOriginEvents();
                    fetchOriginTasks();
                    closeEventModal();
                } else {
                    console.error('Failed to delete event');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
    };

    const getTasksByEvent = useCallback(async () => {
        const tasks = await request_getTasksByEvent(event.id);
        setTasks(tasks);
    }, [event.id]);

    const handleClose = () => closeDeleteModal();

    /* UseEffect */
    useEffect(() => {
        if (isModalOpen) getTasksByEvent();
    }, [isModalOpen, getTasksByEvent]);

    return (
        <dialog open={isModalOpen} className="modal modal-open max-h-screen max-w-screen">
            <div
                className="modal-box max-w-md rounded-lg bg-white shadow-lg transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-bold text-red-600 mb-4">
                    Delete Event Confirmation
                </h3>
                <EventOption event={event}/>
                <p className="text-sm text-gray-600 my-4">
                    Deleting this event will also remove the following linked tasks:
                </p>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold mt-4 mb-2">Linked Tasks</h4>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskOption key={task.id} task={task}/>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No linked tasks.</p>
                    )}
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        className="btn btn-outline btn-sm text-gray-700 border-gray-300 hover:border-gray-400"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error btn-sm text-white bg-red-600 hover:bg-red-700"
                        onClick={deleteEvent}
                    >
                        Delete Event
                    </button>
                </div>
            </div>
        </dialog>
    );
};
