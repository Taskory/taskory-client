import {EventSummary} from "../../../api/event/EventsTypes";
import React, {useEffect, useState} from "react";
import {StylesForEachEventInterface} from "../week/WeeklyInterface";
import {processEventPosition} from "../week/WeeklyUtils";
import {EventBlock} from "./EventBlock";

interface DayColumnProps {
    events: EventSummary[]
}

// DayColumn common for rendering time slots and events for a single day
export const DayColumn: React.FC<DayColumnProps> = ({ events }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const [styledEvents, setStyledEvents] = useState<StylesForEachEventInterface[]>([]);

    useEffect(() => {
        if (events) {
            const styledEvents: StylesForEachEventInterface[] = processEventPosition(events);
            setStyledEvents(styledEvents);
        }
    }, [events]);

    return (
        <div className="relative border-r">
            {hours.map((_, i) => (
                <div key={i} className="h-cellHeight border-b hover:bg-gray-100 cursor-pointer"></div>
            ))}
            {/* Render each EventBlock for the day */}
            {styledEvents.map((event, index) => (
                <EventBlock
                    key={index}
                    top={event.top}
                    bottom={event.bottom}
                    left={event.left}
                    color={event.color}
                    title={event.title}
                    id={event.id}
                />
            ))}
        </div>
    );
};
