import {EventSummary} from "../../../api/event/EventsTypes";
import React from "react";
import calendar from "../../../constants/calendar.json";
import {DayColumn} from "./DayColumn";

interface WeekdayColumnProps {
    under24hoursEvents: EventSummary[][];
}

// WeekdayColumns component for rendering DayColumn components for each day of the week
export const WeekdayColumns: React.FC<WeekdayColumnProps> = ({ under24hoursEvents }) => {
    return (
        <>
            {calendar.daysOfWeek.map((_, index) => (
                <DayColumn key={index} events={under24hoursEvents[index]} />
            ))}
        </>
    );
};
