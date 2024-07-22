import React, {useEffect, useState} from "react";
import {useCalendar} from "./context/CalendarContext";
import {EventInterface} from "../../api/interface/EventInterface";
import {WeekCalendarHeader} from "./component/WeekCalendarHeader";
import {WeekInfoInterface} from "./interface/WeekCalendarInterfaces";
import {splitEvents} from "./util/WeekCalendarUtils";
import {DayLine} from "./component/DayLine";
import {TimeLine} from "./component/TimeLine";

export const WeekCalendar: React.FC = () => {
    const { currentDate, events } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
    });
    const [weeklyEvents, setWeeklyEvents] = useState<EventInterface[][]>([[], [], [], [], [], [], []]);

    useEffect(() => {
        setWeekInfo({
            startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
        });
    }, [currentDate]);

    useEffect(() => {
        const startingTimeOfWeek: Date = new Date(weekInfo.startSunday.getFullYear(), weekInfo.startSunday.getMonth(), weekInfo.startSunday.getDate(), 0, 0, 0);
        const endingTimeOfWeek: Date = new Date(weekInfo.startSunday);
        endingTimeOfWeek.setDate(endingTimeOfWeek.getDate() + 6);
        endingTimeOfWeek.setHours(23, 59, 59);

        const newWeeklyEvents: EventInterface[][] = [[], [], [], [], [], [], []];

        splitEvents(events, weekInfo.startSunday).forEach((event: EventInterface) => {
            const eventStart: Date = new Date(event.startDateTime);
            const eventEnd: Date = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                let dayIndex = Math.floor((eventStart.getTime() - startingTimeOfWeek.getTime()) / (1000 * 60 * 60 * 24));
                dayIndex = Math.max(0, Math.min(dayIndex, 6)); // Ensure index is within bounds of the week
                newWeeklyEvents[dayIndex].push(event);
            }
        });

        setWeeklyEvents(newWeeklyEvents);
    }, [events, weekInfo.startSunday]);

    function renderDayLines() {
        return <>
            {weeklyEvents.map((events: EventInterface[], index: number) => (
                <DayLine key={index} events={events}/>
            ))}
        </>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <WeekCalendarHeader startDate={weekInfo.startSunday}/>
            <div className="flex flex-grow h-full overflow-y-scroll">
                {/* Weekly Calendar Row Header */}
                <div className="w-[10%]">
                    <TimeLine />
                </div>
                {/* Day Columns */}
                <div className="w-[90%] grid grid-cols-7 border-l border-gray-200">
                    {renderDayLines()}
                </div>
            </div>
        </div>
    );
};