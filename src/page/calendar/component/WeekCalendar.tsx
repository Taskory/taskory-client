import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import { DayLine } from "./component/DayLine";
import { WeekCalendarHeader } from "./component/WeekCalendarHeader";
import {TimeCell} from "./component/TimeCell";

interface WeekInfoInterface {
    startSunday: Date;
}

export const WeekCalendar: React.FC = () => {
    const {currentDate} = useCalendar();
    const [events, setEvents] = useState<EventInterface[]>([]);

    const weekInfo: WeekInfoInterface = useMemo(() => ({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
    }), [currentDate]);

    useEffect(() => {
        // Dummy data
        const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));
        const dummyEvents: EventInterface[] = [
            {
                id: 1,
                title: "Company Meeting",
                tag: {id: 1, title: "Work", color: "yellow"},
                hashtags: [{id: 1, title: "#meeting"}],
                description: "Weekly team meeting to discuss contract updates.",
                startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
                dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 11, 0).toISOString(),
                location: "Conference Room B"
            },
            {
                id: 2,
                title: "Team Meeting",
                tag: {id: 1, title: "Work", color: "blue"},
                hashtags: [{id: 1, title: "#meeting"}],
                description: "Weekly team meeting to discuss project updates.",
                startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
                dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 0).toISOString(),
                location: "Conference Room A"
            },
            {
                id: 3,
                title: "Code Review",
                tag: {id: 2, title: "Work", color: "green"},
                hashtags: [{id: 2, title: "#code"}, {id: 3, title: "#review"}],
                description: "Review the latest code commits.",
                startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 14, 0).toISOString(),
                dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 15, 0).toISOString(),
                location: "Zoom"
            },
            {
                id: 4,
                title: "Lunch with Client",
                tag: {id: 3, title: "Personal", color: "red"},
                hashtags: [{id: 4, title: "#lunch"}, {id: 5, title: "#client"}],
                description: "Discuss project requirements with the client.",
                startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 12, 30).toISOString(),
                dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 13, 30).toISOString(),
                location: "Restaurant B"
            },
            {
                id: 5,
                title: "Yoga Class",
                tag: {id: 4, title: "Health", color: "purple"},
                hashtags: [{id: 6, title: "#yoga"}, {id: 7, title: "#fitness"}],
                description: "Attend the weekly yoga class for relaxation.",
                startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 18, 0).toISOString(),
                dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 19, 0).toISOString(),
                location: "Gym"
            },
            {
                id: 6,
                title: "Project Deadline",
                tag: {id: 5, title: "Work", color: "orange"},
                hashtags: [{id: 8, title: "#deadline"}, {id: 9, title: "#project"}],
                description: "Submit the final project deliverables.",
                startDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 17, 0).toISOString(),
                dueDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 23, 59).toISOString(),
                location: "Office"
            }
        ];

        setEvents(dummyEvents);
    }, [currentDate]);

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
                            <DayLine key={date.toISOString()} hourlyEvents={dayEvents.hourlyEvents}/>
                        </div>
                    );
                })}
            </div>
        );
    }

    function renderTimeLines() {
        return (
            // <div className="grid grid-cols-1 h-full w-[10%] bg-gray-100">
            //     {Array.from({length: 24}, (_, hour) => (
            //         <div key={hour} className="flex-grow text-right text-xs h-20 pr-1">
            //             {hour}:00
            //         </div>
            //     ))}
            // </div>
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
