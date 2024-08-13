import React, { useEffect, useState } from "react";
import { useCalendar } from "./context/CalendarContext";
import { WeekCalendarHeader } from "./component/WeekCalendarHeader";
import { WeekInfoInterface } from "./interface/WeekCalendarInterfaces";
import {getEventDayIndex, getWeeklyEvents, initializeWeekInfo} from "./util/WeekCalendarUtils";
import { DayLine } from "./component/DayLine";
import { TimeLine } from "./component/TimeLine";
import {EventSummary} from "../../api/event/EventsTypes";

export const WeekCalendar: React.FC = () => {
    const { currentDate, splitEvents } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>(initializeWeekInfo(currentDate));
    const [under24hoursEvents, setUnder24hoursEvents] = useState<EventSummary[][]>([[], [], [], [], [], [], []]);
    const [over24hoursEvents, setOver24hoursEvents] = useState<EventSummary[][]>([[], [], [], [], [], [], []]);

    useEffect(() => {
        setWeekInfo(initializeWeekInfo(currentDate));
    }, [currentDate]);

    useEffect(() => {
        const startingTimeOfWeek = new Date(weekInfo.startSunday);
        const endingTimeOfWeek = new Date(weekInfo.startSunday);
        endingTimeOfWeek.setDate(endingTimeOfWeek.getDate() + 6);
        endingTimeOfWeek.setHours(23, 59, 59);


        const newUnder24hoursEvents: EventSummary[][] = [[], [], [], [], [], [], []];
        getWeeklyEvents(splitEvents.eventsUnder24, weekInfo.startSunday).forEach((event: EventSummary) => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                newUnder24hoursEvents[getEventDayIndex(eventStart, startingTimeOfWeek)].push(event);
            }
        });
        setUnder24hoursEvents(newUnder24hoursEvents);

        const newOver24hoursEvents: EventSummary[][] = [[], [], [], [], [], [], []];

        getWeeklyEvents(splitEvents.eventsOver24, weekInfo.startSunday).forEach((event: EventSummary) => {
            const eventStart: Date = new Date(event.startDateTime);
            const eventEnd: Date = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                let currentDay: Date = new Date(eventStart);
                while (currentDay <= eventEnd && currentDay <= endingTimeOfWeek) {
                    if (currentDay >= startingTimeOfWeek) {
                        const dayIndex: number = getEventDayIndex(currentDay, startingTimeOfWeek);
                        newOver24hoursEvents[dayIndex].push(event);
                    }
                    currentDay.setDate(currentDay.getDate() + 1);
                }
            }
        });
        setOver24hoursEvents(newOver24hoursEvents);

    }, [splitEvents, weekInfo.startSunday]);

    const renderDayLines = () =>
        Array.from({length: 7}, (_, index) => (
            <DayLine key={index} under24hoursEvents={under24hoursEvents[index]} over24hoursEvents={over24hoursEvents[index]}/>
        ));

    return (
        <div className="w-full h-full flex flex-col">
            <WeekCalendarHeader startDate={weekInfo.startSunday} />
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                    <TimeLine />
                </div>
                <div className="w-[90%] grid grid-cols-7 border-l border-gray-200">
                    {renderDayLines()}
                </div>
            </div>
        </div>
    );
};
