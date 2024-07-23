import React, { useEffect, useState } from "react";
import { useCalendar } from "./context/CalendarContext";
import { EventInterface } from "../../api/interface/EventInterface";
import { WeekCalendarHeader } from "./component/WeekCalendarHeader";
import { WeekInfoInterface } from "./interface/WeekCalendarInterfaces";
import {getEventDayIndex, initializeWeekInfo, splitEvents} from "./util/WeekCalendarUtils";
import { DayLine } from "./component/DayLine";
import { TimeLine } from "./component/TimeLine";

export const WeekCalendar: React.FC = () => {
    const { currentDate, events } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>(initializeWeekInfo(currentDate));
    const [under24hoursEvents, setUnder24hoursEvents] = useState<EventInterface[][]>([[], [], [], [], [], [], []]);
    const [over24hoursEvents, setOver24hoursEvents] = useState<EventInterface[][]>([[], [], [], [], [], [], []]);

    useEffect(() => {
        setWeekInfo(initializeWeekInfo(currentDate));
    }, [currentDate]);

    useEffect(() => {
        const startingTimeOfWeek = new Date(weekInfo.startSunday);
        const endingTimeOfWeek = new Date(weekInfo.startSunday);
        endingTimeOfWeek.setDate(endingTimeOfWeek.getDate() + 6);
        endingTimeOfWeek.setHours(23, 59, 59);

        const { under24hours, over24hours } = splitEvents(events, weekInfo.startSunday);

        const newUnder24hoursEvents: EventInterface[][] = [[], [], [], [], [], [], []];
        under24hours.forEach((event: EventInterface) => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                newUnder24hoursEvents[getEventDayIndex(eventStart, startingTimeOfWeek)].push(event);
            }
        });
        setUnder24hoursEvents(newUnder24hoursEvents);

        const newOver24hoursEvents: EventInterface[][] = [[], [], [], [], [], [], []];

        over24hours.forEach((event: EventInterface) => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            if (eventEnd >= startingTimeOfWeek && eventStart <= endingTimeOfWeek) {
                // 이벤트의 시작일과 종료일 사이의 모든 요일에 이벤트를 추가합니다.
                let currentDay = new Date(eventStart);
                while (currentDay <= eventEnd && currentDay <= endingTimeOfWeek) {
                    if (currentDay >= startingTimeOfWeek) {
                        const dayIndex = getEventDayIndex(currentDay, startingTimeOfWeek);
                        newOver24hoursEvents[dayIndex].push(event);
                    }
                    currentDay.setDate(currentDay.getDate() + 1);
                }
            }
        });

        // console.log(newOver24hoursEvents);
        setOver24hoursEvents(newOver24hoursEvents);

    }, [events, weekInfo.startSunday]);

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
