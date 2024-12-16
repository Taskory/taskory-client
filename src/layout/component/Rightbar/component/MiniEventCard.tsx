import React from "react";
import { DateInfo, EventSummary } from "../../../../api/event/EventsTypes";
import { TimeUtil } from "../../../../util/TimeUtil";

interface MiniEventCardProps {
    event: EventSummary;
    date: DateInfo | null;
    onClick: (eventId: number) => void;
}

export const MiniEventCard: React.FC<MiniEventCardProps> = ({
                                                                event,
                                                                date,
                                                                onClick,
                                                            }) => {
    const startDateTime: Date = TimeUtil.stringToDate(event.startDateTime);
    const dueDateTime: Date = TimeUtil.stringToDate(event.dueDateTime);
    const selectedDate: Date | null = date
        ? new Date(date.year, date.month - 1, date.day)
        : null;

    const time = TimeUtil.calculateTimeDisplay(startDateTime, dueDateTime, selectedDate);

    return (
        <div
            className="items-center justify-between p-1 bg-gray-50 rounded-lg text-sm shadow-md hover:bg-gray-100 transition cursor-pointer"
            onClick={() => onClick(event.id)}
        >
            {/* Event Title with Colored Tag */}
            <p
                className={`font-semibold text-${event.tag.color.toLowerCase() as string}-600 truncate`}
                title={event.title}
            >
                ● {event.title}
            </p>
            {/* Event Timing */}
            <p className="text-xs text-gray-600">{time}</p>
        </div>
    );
};
