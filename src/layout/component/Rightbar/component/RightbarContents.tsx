import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        setDateInfo(selectedDateEventInfo.date);
        setEvents(selectedDateEventInfo.events);
    }, [selectedDateEventInfo]);

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);

    function formatDateInfo(dateInfo: DateInfo | null): string {
        if (dateInfo) {
            return `${dateInfo.year}-${dateInfo.month.toString().padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`;
        } else return "";
    }

    function renderTagBtnList() {
        return (
            <div className={`flex items-center justify-between group mt-2`}>
                <div className="flex items-center gap-1 w-full">
                    <button onClick={selectAllTags}
                            className="p-1 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                        Select All
                    </button>
                    <button onClick={clearAllTags}
                            className="p-1 bg-gray-600 text-white rounded-lg text-xs font-medium shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-500">
                        Clear All
                    </button>
                </div>

                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="btn btn-xs bg-green-600">
                    +
                </button>

                {isDropdownOpen && (
                    <TagInfoDropbox
                        onClose={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>

        );
    }

    return (
        <div className="p-2 bg-white rounded-lg shadow-lg overflow-x-hidden">
            {/* Tags Section */}
            <div>
                <button
                    onClick={() => setIsTagsOpen((prev) => !prev)}
                    className="w-full flex justify-between items-center py-2 px-3 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                    <span>Tags</span>
                    <span>{isTagsOpen ? "-" : "+"}</span>
                </button>
                {isTagsOpen && (
                    <>
                        {/* Action Buttons */}
                        {renderTagBtnList()}

                        {/* Render tag list */}
                        <div className="mt-2 space-y-2 border-b pb-3 max-h-48 overflow-y-auto overflow-x-hidden">
                            {userTags.map((tag) => (
                                <TagItem key={tag.id} tag={tag}/>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Events Section */}
            <div className="mt-4">
                <button
                    onClick={() => setIsEventsOpen((prev) => !prev)}
                    className="w-full flex justify-between items-center py-2 px-3 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                    <span>Events</span>
                    <span>{formatDateInfo(dateInfo)}</span>
                    <span>{isEventsOpen ? "-" : "+"}</span>
                </button>
                {isEventsOpen && (
                    <div
                        className="mt-2 space-y-2 border-b pb-3 max-h-48 overflow-y-auto">
                        {events.map((event) => (
                            <MiniEventCard
                                key={event.id}
                                event={event}
                                date={dateInfo}
                                onClick={openEventModal}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
            };
