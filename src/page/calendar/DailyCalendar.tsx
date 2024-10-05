import React, {useEffect, useState} from "react";
import {useCalendar} from "./context/CalendarContext";
import {EventSummary} from "../../api/event/EventsTypes";
import {StylesForEachEventInterface} from "./interface/WeekCalendarInterfaces";
import {EventCell} from "./component/EventCell";
import {processEventPosition} from "./util/WeekCalendarUtils";

export const DailyCalendar: React.FC = () => {
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

    const [styledEvents, setStyledEvents] = useState<StylesForEachEventInterface[]>([]);
    const [multiDayEvents, setMultiDayEvents] = useState<EventSummary[]>([]);

    useEffect(() => {
        if (eventsUnder24) {
            const styledEvents: StylesForEachEventInterface[] = processEventPosition(eventsUnder24);
            setStyledEvents(styledEvents);
        }
    }, [eventsUnder24]);

    useEffect(() => {
        setMultiDayEvents(eventsOver24);
    }, [eventsOver24]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                    {Array.from({length: 24}, (_, hour: number) => (
                        <div key={hour}
                             className="h-weekCalendarCellHeight border-t border-gray-200 flex items-start justify-end pr-1 text-xs font-semibold">
                            {hour}:00
                        </div>
                    ))}
                </div>
                {/* Day Columns */}
                <div className="w-[90%] border-l border-gray-200">
                    {/*<DayLine under24hoursEvents={eventsUnder24} over24hoursEvents={eventsOver24}/>*/}
                    <div className="grid">
                        <div className="h-weekCalendarCellHeight border-t border-r border-gray-200 border-b-2">
                            {multiDayEvents.map((event: EventSummary, idx: number) => {
                                const textColor: string = `text-${event.tagColor.toLowerCase()}-500`;
                                return (
                                    <button key={idx}
                                            className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                                        <span
                                            className={`text-sm px-1 font-semibold ${textColor}`}>●{event.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="relative border-r border-gray-200 h-full">
                            <div className="absolute w-full h-[1200px]">
                                {styledEvents.map((event: StylesForEachEventInterface, idx: number) => {
                                    return (
                                        <EventCell
                                            key={idx}
                                            top={event.top}
                                            bottom={event.bottom}
                                            title={event.title}
                                            left={event.left}
                                            color={event.color}
                                            id={event.id}
                                        />
                                    )
                                })}
                            </div>
                            {Array.from({length: 24}, (_, hour: number) => (
                                <div key={hour} className="h-weekCalendarCellHeight border-t border-gray-200"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};