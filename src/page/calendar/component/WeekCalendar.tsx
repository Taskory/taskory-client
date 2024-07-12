import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import { WeekCalendarHeader } from "./component/WeekCalendarHeader";
import {useTestData} from "../context/TestDataContext";

interface WeekInfoInterface {
    startSunday: Date;
}

export const WeekCalendar: React.FC = () => {
    const {currentDate} = useCalendar();
    const {dummyEvents} = useTestData();
    const [events, setEvents] = useState<EventInterface[]>([]);

    const weekInfo: WeekInfoInterface = useMemo(() => ({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
    }), [currentDate]);

    useEffect(() => {
        setEvents(dummyEvents);
    }, [dummyEvents]);

    const getEventsForDay = useCallback((date: Date): {
        hourlyEvents: EventInterface[][],
        allDayEvents: EventInterface[]
    } => {
        const hourlyEvents: EventInterface[][] = Array.from({length: 24}, () => []);
        const allDayEvents: EventInterface[] = [];

        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        events.forEach(event => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            if (eventStart <= endOfDay && eventEnd >= startOfDay) {
                // Event spans across the entire day
                if (eventStart <= startOfDay && eventEnd >= endOfDay) {
                    allDayEvents.push(event);
                }
                // Event spans multiple days but not the entire day
                else if (eventStart.getDate() !== date.getDate() || eventEnd.getDate() !== date.getDate()) {
                    if (eventStart <= startOfDay && eventEnd >= startOfDay && eventEnd <= endOfDay) {
                        // Event ends within the day
                        const endHour = eventEnd.getHours();
                        for (let hour = 0; hour <= endHour; hour++) {
                            hourlyEvents[hour].push(event);
                        }
                    } else if (eventStart >= startOfDay && eventStart <= endOfDay && eventEnd >= endOfDay) {
                        // Event starts within the day
                        const startHour = eventStart.getHours();
                        for (let hour = startHour; hour < 24; hour++) {
                            hourlyEvents[hour].push(event);
                        }
                    } else if (eventStart <= startOfDay && eventEnd >= endOfDay) {
                        // Event spans the entire day
                        allDayEvents.push(event);
                    } else {
                        // Event spans multiple days but not starting or ending on this day
                        allDayEvents.push(event);
                    }
                }
                // Event is within the day
                else {
                    const startHour = eventStart.getHours();
                    const endHour = eventEnd.getHours();

                    for (let hour = startHour; hour <= endHour; hour++) {
                        if (hour >= 0 && hour < 24) {
                            hourlyEvents[hour].push(event);
                        }
                    }
                }
            }
        });

        return {hourlyEvents, allDayEvents};
    }, [events]);


    function renderDayLines() {
        return (
            <div className="grid grid-cols-7 w-[90%] h-full">
                {Array.from({length: 7}, (_, index) => {
                    const date = new Date(weekInfo.startSunday.getFullYear(), weekInfo.startSunday.getMonth(), weekInfo.startSunday.getDate() + index);
                    const dayEvents = getEventsForDay(date);
                    return (
                        <div key={index} className="grid grid-rows-24">
                            {dayEvents.hourlyEvents.map((events, hour) => (
                                <div className={`h-20 grid ${events.length > 0 ? `grid-cols-${events.length}` : 'border'}`}>
                                    {events.map((event, index) => (
                                        <div key={index}
                                             className={`p-1 text-xs text-center content-center bg-${event.tag.color.toLowerCase()}-400 w-full h-full`}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    }

    function renderTimeLines() {
        return (
            <div className="w-[10%]">
                {Array.from({length: 24}, (_, hour) => (
                    <div key={hour} className="h-20 w-full bg-gray-100">
                        <div className="flex justify-end text-xs pr-1 border-gray-200 w-full">
                            {hour}:00
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <WeekCalendarHeader startDate={weekInfo.startSunday}/>
            <div className="flex overflow-y-auto flex-grow h-[95%]">
                {renderTimeLines()}
                {renderDayLines()}
            </div>
        </div>
    );
};
