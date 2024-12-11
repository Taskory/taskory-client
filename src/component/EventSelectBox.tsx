import React, { Dispatch, SetStateAction, useState } from "react";
import { EventSummary } from "../api/event/EventsTypes";
import {getTagStringColor} from "../util/TagUtil";
import {TagBadge} from "./TagBadge";

interface EventSelectBoxProps {
    eventList: EventSummary[];
    event: EventSummary | null;
    setEvent: Dispatch<SetStateAction<EventSummary | null>>;
}

const EventOption: React.FC<{ event: EventSummary }> = ({event}) => {
    return (
        <div className="grid grid-cols-2 items-center h-7 w-full">
            <div className={`${getTagStringColor(event.tagColor)} flex items-center gap-2`}>
                <TagBadge tagColor={event.tagColor} tagTitle={event.tagTitle}/>
                <p className="overflow-hidden truncate">{event.title}</p>
            </div>
            <div className="flex justify-end">
                {getDisplayDate(event.startDateTime, event.dueDateTime)}
            </div>
        </div>
    );
}

export const EventSelectBox: React.FC<EventSelectBoxProps> = ({eventList, event, setEvent}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (selectedEvent: EventSummary | null) => {
        setEvent(selectedEvent);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative w-full">
            {/* Display the selected event or a placeholder */}
            <div
                className="flex justify-between items-center p-1 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400"
                onClick={toggleDropdown}
            >
                {event ? (
                        <EventOption event={event}/>
                    )
                    :
                    (
                        <p className="h-7 p-1 hover:bg-gray-100 cursor-pointer bg-gray-50">
                            Select an event
                        </p>
                    )}
                <span className="ml-2">{isDropdownOpen ? "▲" : "▼"}</span>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <ul className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    <li
                        className="p-1 hover:bg-gray-100 cursor-pointer bg-gray-50"
                        onClick={() => handleSelect(null)}> Select an event(No event)
                    </li>
                    {eventList.map((event) => (
                        <li
                            key={event.id}
                            className="p-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(event)}
                        >

                            <EventOption event={event}/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
const getDisplayDate = (startDateTime: string, dueDateTime: string): string => {
    const startDate = new Date(startDateTime);
    const dueDate = new Date(dueDateTime);

    const formatDate = (date: Date): string => {
        const yy = date.getFullYear().toString().slice(2); // 연도 두 자리
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
        const dd = String(date.getDate()).padStart(2, "0"); // 일
        return `${yy}.${mm}.${dd}`;
    };

    const startFormatted = formatDate(startDate);
    const dueFormatted = formatDate(dueDate);

    if (startFormatted === dueFormatted) {
        return startFormatted;
    } else {
        return `${startFormatted}~${dueFormatted}`;
    }
};
