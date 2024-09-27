// CalendarCell.tsx
import React, { useState } from 'react';
import { EventSummary } from "../../../api/event/EventsTypes";
import EventModal from "../EventModal";
import { useCalendar } from "../context/CalendarContext";

interface MonthCalendarCellProps {
    day: number;
    events?: EventSummary[];
    isCurrentMonth: boolean;
}

export const MonthCalendarCell: React.FC<MonthCalendarCellProps> = ({ day, events = [], isCurrentMonth }) => {
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

    return (
        <>
            <div className={`border h-full overflow-hidden relative flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="text-left ml-2 mt-1">{day}</div>
                <div className={`overflow-hidden flex flex-col-reverse mb-1 h-full`}>
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
            </div>

            {isModalOpen && selectedEventId && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    id={selectedEventId}
                    refetchEvents={refetchEvents}
                />
            )}
        </>
    );
};
