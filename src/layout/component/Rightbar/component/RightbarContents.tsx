import React, { useEffect, useState, useRef } from "react";
import { useTagContext } from "../../../../context/data/TagContext";
import { TagItem } from "./TagItem";
import { TagInfoDropbox } from "./TagInfoDropbox";
import { useEventContext } from "../../../../context/data/EventContext";
import { DateInfo, EventSummary } from "../../../../api/event/EventsTypes";
import { useEventModal } from "../../../../context/modal/EventModalContext";
import { MiniEventCard } from "./MiniEventCard";

export const RightbarContents = () => {
    const { userTags, setSelectedTagIds } = useTagContext();
    const { selectedDateEventInfo } = useEventContext();
    const { openEventModal } = useEventModal();

    const [events, setEvents] = useState<EventSummary[]>(selectedDateEventInfo.events);
    const [dateInfo, setDateInfo] = useState<DateInfo | null>(selectedDateEventInfo.date);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(true);
    const [isEventsOpen, setIsEventsOpen] = useState(true);

    const tagRef = useRef<HTMLDivElement | null>(null);
    const eventRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setDateInfo(selectedDateEventInfo.date);
        setEvents(selectedDateEventInfo.events);
    }, [selectedDateEventInfo]);

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={selectAllTags}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                    Select All
                </button>
                <button
                    onClick={clearAllTags}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                >
                    Clear All
                </button>
                <button
                    onClick={toggleDropdown}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                    + Tag
                </button>
                {isDropdownOpen && (
                    <TagInfoDropbox onClose={() => setIsDropdownOpen(false)} />
                )}
            </div>

            {/* Tags Section */}
            <div>
                <button
                    onClick={() => setIsTagsOpen((prev) => !prev)}
                    className="w-full flex justify-between items-center py-2 px-3 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                    <span>Tags</span>
                    <span>{isTagsOpen ? "-" : "+"}</span>
                </button>
                <div
                    ref={tagRef}
                    className="overflow-hidden transition-max-height duration-300 ease-in-out"
                    style={{
                        maxHeight: isTagsOpen
                            ? `${tagRef.current?.scrollHeight || 0}px`
                            : "0px",
                    }}
                >
                    <div className="mt-2 space-y-2 border-b pb-3">
                        {userTags.map((tag, index) => (
                            <TagItem key={index} tag={tag} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div className="mt-4">
                <button
                    onClick={() => setIsEventsOpen((prev) => !prev)}
                    className="w-full flex justify-between items-center py-2 px-3 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                    <span>Events</span>
                    <span>{isEventsOpen ? "-" : "+"}</span>
                </button>
                <div
                    ref={eventRef}
                    className="overflow-hidden transition-max-height duration-300 ease-in-out"
                    style={{
                        maxHeight: isEventsOpen
                            ? `${eventRef.current?.scrollHeight || 0}px`
                            : "0px",
                    }}
                >
                    <div className="space-y-3 mt-3">
                        <h4 className="text-sm text-gray-500 font-medium mb-2">
                            {dateInfo ? `${dateInfo.year}-${dateInfo.month}-${dateInfo.day}` : ""}
                        </h4>
                        {events.map((event) => (
                            <MiniEventCard
                                key={event.id}
                                event={event}
                                date={dateInfo}
                                onClick={openEventModal}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
