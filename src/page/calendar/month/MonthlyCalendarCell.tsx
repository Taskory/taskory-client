import React from 'react';
import { EventSummary } from "../../../api/event/EventsTypes";
import {useEventModal} from "../context/EventModalContext";

interface MonthCalendarCellProps {
    day: number;
    events?: EventSummary[];
    isCurrentMonth: boolean;
}

export const MonthlyCalendarCell: React.FC<MonthCalendarCellProps> = ({ day, events = [], isCurrentMonth }) => {
    const {openEventModal} = useEventModal();

    const handleOpenModal= (id: number) => {
        if (id) {
            openEventModal(id);
        }
    }

    return (
        <>
            <div className={`border-b border-r h-full overflow-hidden relative flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="text-left ml-2 mt-1">{day}</div>
                <div className={`overflow-hidden flex flex-col-reverse mb-1 h-full`}>
                    {events.map((event, idx) => {
                        const textColor = `text-${event.tagColor.toLowerCase()}-500`;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleOpenModal(event.id)}
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
        </>
    );
};
