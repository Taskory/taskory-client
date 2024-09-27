// import React from 'react';
//
// interface CellProps {
//     children?: React.ReactNode;
//     className?: string;
// }
//
// export const Cell: React.FC<CellProps> = ({ children, className }) => {
//     return (
//         <div className={`border h-36 overflow-hidden relative flex flex-col ${className}`}>
//             {children}
//         </div>
//     );
// };


import React, { useState } from 'react';
import { EventSummary } from "../../../api/event/EventsTypes";
import EventModal from "../EventModal";
import { useCalendar } from "../context/CalendarContext"; // Adjust the import path as necessary

interface CellProps {
    day?: number;  // Optional, used for day numbers
    events?: EventSummary[];  // Optional, used for cells with events
    isEmpty?: boolean;  // Flag to indicate if the cell is empty (i.e., before the first day or after the last day)
    className?: string;  // Custom styles
}

export const Cell: React.FC<CellProps> = ({ day, events = [], isEmpty = false, className = '' }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { refetchEvents } = useCalendar();

    const handleEventClick = (eventId: number) => {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEventId(null);
    };

    // Cell rendering
    return (
        <div className={`border h-36 overflow-hidden relative flex flex-col ${className}`}>
            {!isEmpty && (
                <>
                    <div className="text-left ml-2 mt-1 h-full row-span-1">{day}</div>
                    <div className="overflow-hidden h-full flex flex-col-reverse mb-1">
                        {events.map((event, idx) => {
                            const textColor = `text-${event.tagColor.toLowerCase()}-500`;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleEventClick(event.id)}
                                    className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    <span className={`text-sm px-1 font-semibold ${textColor}`}>
                                        ●{event.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
            {isEmpty && <div className="text-left ml-2 mt-1 h-full row-span-1"></div>}

            {isModalOpen && selectedEventId && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    id={selectedEventId}
                    refetchEvents={refetchEvents}
                />
            )}
        </div>
    );
};

