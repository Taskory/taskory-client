import React, { useState } from 'react';
import { Cell } from './Cell';
import { EventSummary } from "../../../api/event/EventsTypes";
import EventModal from "../EventModal";
import {useCalendar} from "../context/CalendarContext"; // Adjust the import path as necessary

interface DayProps {
    day: number;
    events: EventSummary[];
}

// @Deprecated
export const DayCell: React.FC<DayProps> = ({ day, events }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // State to track selected event ID
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
    const {refetchEvents} = useCalendar();

    // Opens the modal and sets the selected event ID
    const handleEventClick = (eventId: number) => {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    // Closes the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEventId(null);
    };

    return (
        <>
            {/* DayCell content */}
            {/*<Cell className={`h-full grid`}>*/}
            {/*    <div className="text-left ml-2 mt-1 h-full row-span-1">{day}</div>*/}
            {/*    <div className={`overflow-hidden h-full flex flex-col-reverse mb-1`}>*/}
            {/*        {events.map((event, idx) => {*/}
            {/*            const textColor = `text-${event.tagColor.toLowerCase()}-500`;*/}
            {/*            return (*/}
            {/*                <button*/}
            {/*                    key={idx}*/}
            {/*                    onClick={() => handleEventClick(event.id)} // Open the modal when event is clicked*/}
            {/*                    className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis"*/}
            {/*                >*/}
            {/*                    <span className={`text-sm px-1 font-semibold ${textColor}`}>*/}
            {/*                        ●{event.title}*/}
            {/*                    </span>*/}
            {/*                </button>*/}
            {/*            );*/}
            {/*        })}*/}
            {/*    </div>*/}
            {/*</Cell>*/}

            {/* EventModal Component */}
            {isModalOpen && selectedEventId && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    id={selectedEventId} // Pass the selected event ID to the modal
                    refetchEvents={refetchEvents}
                />
            )}
        </>
    );
};
