import React, { useCallback, useEffect, useState } from "react";
import { request_deleteTag } from "../api/tag/TagApi";
import { useEventContext } from "../context/data/EventContext";
import { useTaskContext } from "../context/data/TaskContext";
import { useTagContext } from "../context/data/TagContext";
import { TagResponse } from "../api/tag/TagTypes";
import { request_getEventsByTags } from "../api/event/EventApi";
import { request_getTasksByTags } from "../api/task/TaskApi";
import { EventSummary } from "../api/event/EventsTypes";
import { TaskSummary } from "../api/task/TaskTypes";
import { EventOption } from "../component/EventOption";
import { TaskOption } from "../component/TaskOption";
import { TagBadge } from "../component/TagBadge";

interface TagDeleteWarningModalProps {
    tag: TagResponse;
    onTagInfoBoxClose: () => void;
    isModalOpen: boolean;
    toggleModal: () => void;
}

export const TagDeleteWarningModal: React.FC<TagDeleteWarningModalProps> = ({
                                                                                tag,
                                                                                onTagInfoBoxClose,
                                                                                isModalOpen,
                                                                                toggleModal,
                                                                            }) => {
    /* Context */
    const { fetchOriginEvents } = useEventContext();
    const { fetchOriginTasks } = useTaskContext();
    const { setUserTags } = useTagContext();

    /* Management state*/
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [tasks, setTasks] = useState<TaskSummary[]>([]);

    /* Functions */
    const deleteTag = async () => {

        if (!tag) return;
        const response = await request_deleteTag(tag.id);

        if (response) {
            setUserTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
            fetchOriginEvents();
            fetchOriginTasks();
            onTagInfoBoxClose();
        }
    };
    const getEventsAndTasksByTags = useCallback(async () => {
        const [events, tasks] = await Promise.all([
            request_getEventsByTags([tag.id]),
            request_getTasksByTags([tag.id]),
        ]);
        setEvents(events);
        setTasks(tasks);
    }, [tag.id]);

    const handleClose = () => toggleModal();

    /* UseEffect */
    useEffect(() => {
        if (isModalOpen) getEventsAndTasksByTags();
    }, [isModalOpen, getEventsAndTasksByTags]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                isModalOpen ? "bg-black bg-opacity-50 opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div className="modal-box max-w-md rounded-lg bg-white shadow-lg transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-bold text-red-600 mb-4">
                    Delete Tag Confirmation
                </h3>
                <TagBadge tagColor={tag.color} tagTitle={tag.title} />
                <p className="text-sm text-gray-600 my-4">
                    Deleting this tag will also remove the following linked events and tasks:
                </p>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold mb-2">Linked Events</h4>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventOption key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No linked events.</p>
                    )}

                    <h4 className="text-sm font-semibold mt-4 mb-2">Linked Tasks</h4>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskOption key={task.id} task={task} />
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
                        onClick={deleteTag}
                    >
                        Delete Tag
                    </button>
                </div>
            </div>
        </div>
    );
};
