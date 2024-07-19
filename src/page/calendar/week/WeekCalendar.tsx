import React, {useCallback, useEffect, useState} from "react";
import {useCalendar} from "../context/CalendarContext";
import {EventInterface} from "../../../api/interface/EventInterface";
import {WeekCalendarHeader} from "./component/WeekCalendarHeader";
import {useTestData} from "../context/TestDataContext";
import {WeekInfoInterface} from "./interface/WeekCalendarInterfaces";
import {splitEvents} from "./util/WeekCalendarUtils";
import {DayColumn} from "./component/DayColumn";

export const WeekCalendar: React.FC = () => {
    const { currentDate } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
    });
    const { dummyEvents } = useTestData();
    const [events, setEvents] = useState<EventInterface[]>([]);
    const initialWeeklyEvents: EventInterface[][] = [[], [], [], [], [], [], []];
    const [weeklyEvents, setWeeklyEvents] = useState<EventInterface[][]>(initialWeeklyEvents);

    const updateWeekInfo = useCallback(() => {
        setWeekInfo({
            startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
        });
    }, [currentDate]);

    useEffect(() => {
        updateWeekInfo();
    }, [currentDate, updateWeekInfo]);

    useEffect(() => {
        setEvents(splitEvents(dummyEvents, weekInfo.startSunday));
    }, [dummyEvents, weekInfo.startSunday]);

    const updateWeeklyEvents = useCallback((events: EventInterface[]) => {
        const startingTimeOfWeek: Date = new Date(weekInfo.startSunday.getFullYear(), weekInfo.startSunday.getMonth(), weekInfo.startSunday.getDate(), 0, 0, 0);
        const endingTimeOfWeek: Date = new Date(weekInfo.startSunday);
        endingTimeOfWeek.setDate(endingTimeOfWeek.getDate() + 6);
        endingTimeOfWeek.setHours(23, 59, 59);

        const newWeeklyEvents: EventInterface[][] = [[], [], [], [], [], [], []];

        events.forEach((event: EventInterface) => {
            const eventStart: Date = new Date(event.startDateTime);
            const eventEnd: Date = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                let dayIndex = Math.floor((eventStart.getTime() - startingTimeOfWeek.getTime()) / (1000 * 60 * 60 * 24));
                dayIndex = Math.max(0, Math.min(dayIndex, 6)); // Ensure index is within bounds of the week
                newWeeklyEvents[dayIndex].push(event);
            }
        });

        setWeeklyEvents(newWeeklyEvents);
    }, [weekInfo.startSunday]);

    useEffect(() => {
        updateWeeklyEvents(events);
    }, [events, updateWeeklyEvents]);

    return (
        <div className="w-full h-full flex flex-col">
            <WeekCalendarHeader startDate={weekInfo.startSunday}/>
            <div className="flex flex-grow h-full overflow-y-scroll">
                {/* Weekly Calendar Row Header */}
                <div className="w-[10%]">
                    <div
                        className="h-weekCalendarCellHeight border-t border-gray-200 flex items-start justify-end pr-1 text-xs font-semibold">
                        all day events
                    </div>
                    {Array.from({length: 24}, (_, hour: number) => (
                        <div key={hour}
                             className="h-weekCalendarCellHeight border-t border-gray-200 flex items-start justify-end pr-1 text-xs font-semibold">
                            {hour}:00
                        </div>
                    ))}
                </div>
                {/* Day Columns */}
                <div className="w-[90%] grid grid-cols-7 border-l border-gray-200">
                    {weeklyEvents.map((events: EventInterface[], index: number) => (
                        <DayColumn key={index} events={events}/>
                    ))}
                </div>
            </div>
        </div>
    );
};