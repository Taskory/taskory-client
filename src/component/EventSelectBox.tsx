import React, {useState} from "react";
import {EventSummary} from "../api/event/EventsTypes";
import {EventOption} from "./EventOption";

interface EventSelectBoxProps {
    eventList: EventSummary[],
    event: EventSummary | null,
    setEvent: (event: EventSummary | null) => void
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
