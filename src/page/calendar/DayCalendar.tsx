import React, {useEffect, useState} from "react";
import {useCalendar} from "./context/CalendarContext";
import {TimeLine} from "./component/TimeLine";
import {DayLine} from "./component/DayLine";
import {EventSummary} from "../../api/event/EventsTypes";

export const DayCalendar: React.FC = () => {
    const { currentDate, splitEvents } = useCalendar();
    const [eventsUnder24, setEventsUnder24] = useState<EventSummary[]>(getEventsForDate(splitEvents.eventsUnder24, currentDate));
    const [eventsOver24, setEventsOver24] = useState<EventSummary[]>(getEventsForDate(splitEvents.eventsOver24, currentDate));

    useEffect(() => {
        setEventsUnder24(getEventsForDate(splitEvents.eventsUnder24, currentDate));
        setEventsOver24(getEventsForDate(splitEvents.eventsOver24, currentDate));
    }, [currentDate, splitEvents]);

    function getEventsForDate(events: EventSummary[], date: Date): EventSummary[] {
        const result: EventSummary[] = [];

        // Normalize the input date to ignore the time part
        const inputDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        events.forEach((event: EventSummary) => {
            const eventStartDate: Date = new Date(event.startDateTime);
            const eventDueDate: Date = new Date(event.dueDateTime);

            // Normalize event start and due dates to ignore the time part
            const normalizedStartDate: Date = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
            const normalizedDueDate: Date = new Date(eventDueDate.getFullYear(), eventDueDate.getMonth(), eventDueDate.getDate());

            // Check if the input date is within the event's start and due date range (inclusive)
            if (
                normalizedStartDate <= inputDate &&
                normalizedDueDate >= inputDate
            ) {
                result.push(event);
            }
        });

        return result;
    }
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                   <TimeLine />
                </div>
                {/* Day Columns */}
                <div className="w-[90%] border-l border-gray-200">
                    <DayLine under24hoursEvents={eventsUnder24} over24hoursEvents={eventsOver24} />
                </div>
            </div>
        </div>
    );
};