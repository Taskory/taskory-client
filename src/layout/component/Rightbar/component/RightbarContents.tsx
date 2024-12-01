import React, { useEffect, useState } from "react";
import { useTagContext } from "../../../../context/data/TagContext";
import { TagItem } from "./TagItem";
import { TagInfoDropbox } from "./TagInfoDropbox";
import { useEventContext } from "../../../../context/data/EventContext";
import {DateInfo, EventSummary} from "../../../../api/event/EventsTypes";
import {useEventModal} from "../../../../context/modal/EventModalContext";

export const RightbarContents = () => {
    /* Context */
    const { userTags, setSelectedTagIds } = useTagContext();
    const { selectedDateEventInfo } = useEventContext();
    const {openEventModal} = useEventModal();
    /* useState */
    const [events, setEvents] = useState<EventSummary[]>(selectedDateEventInfo.events);
    const [dateInfo, setDateInfo] = useState<DateInfo | null>(selectedDateEventInfo.date);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setDateInfo(selectedDateEventInfo.date);
        setEvents(selectedDateEventInfo.events);
    }, [selectedDateEventInfo]);

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={selectAllTags}
                    className="px-3 py-1 font-medium bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                    Select All
                </button>
                <button
                    onClick={clearAllTags}
                    className="px-3 py-1 font-medium bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                >
                    Clear All
                </button>
                <button
                    onClick={toggleDropdown}
                    className="px-3 py-1 font-medium bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                >
                    + Tag
                </button>
                {isDropdownOpen && (
                    <TagInfoDropbox onClose={() => setIsDropdownOpen(false)} />
                )}
            </div>

            {/* Tags List Section */}
            <div className="border-b pb-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Tags
                </h3>
                <div className="space-y-2">
                    {userTags.map((tag, index) => (
                        <TagItem key={index} tag={tag} />
                    ))}
                </div>
            </div>

            {/* Events List Section */}
            <div>
                <div className="flex gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Events
                    </h3>
                    <h4>{dateInfo ? `${dateInfo.year}-${dateInfo.month}-${dateInfo.day}` : ''}</h4>
                </div>

                <div className="space-y-2">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                            onClick={() => openEventModal(event.id)}
                        >
                            <span
                                className={`text-sm font-medium text-${event.tagColor.toLowerCase()}-500 truncate`}
                            >
                                ● {event.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
