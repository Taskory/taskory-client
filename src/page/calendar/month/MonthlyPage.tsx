// MonthlyPage.tsx
import React, { useEffect, useState } from "react";
import { MonthlyCalendarCell } from "./MonthlyCalendarCell";
import { useCalendar } from "../context/CalendarContext";
import { splitEventsPerDay } from "./MonthlyUtils";
import {DateInfo} from "../../../api/event/EventsTypes";

export const MonthlyPage: React.FC = () => {
    const { currentDate, monthlyEvents } = useCalendar();
    const [eventsPerDayArray, setEventsPerDayArray] = useState(splitEventsPerDay(monthlyEvents, currentDate));
    const [monthInfo, setMonthInfo] = useState({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
    });

    useEffect(() => {
        setMonthInfo({
            daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
            firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        });
        setEventsPerDayArray(splitEventsPerDay(monthlyEvents, currentDate));
    }, [currentDate, monthlyEvents]);

    const weeksOfCurrentMonth = Math.ceil((monthInfo.firstDayOfWeek + monthInfo.daysInMonth) / 7);

    const renderCalendarCells = () => {
        const totalCells = weeksOfCurrentMonth * 7;
        const cells = [];
        const previousMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        for (let i = 0; i < totalCells; i++) {
            const dayOfMonth = i - monthInfo.firstDayOfWeek + 1;
            if (i < monthInfo.firstDayOfWeek) {
                // Previous month's days
                const date: DateInfo= {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth(),
                    day: previousMonthDays - monthInfo.firstDayOfWeek + i + 1,
                };
                cells.push(<MonthlyCalendarCell key={i} day={previousMonthDays - monthInfo.firstDayOfWeek + i + 1} isCurrentMonth={false} date={date} />);
            } else if (dayOfMonth > monthInfo.daysInMonth) {
                // Next month's days
                const date: DateInfo = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 2,
                    day: dayOfMonth - monthInfo.daysInMonth,
                }
                cells.push(<MonthlyCalendarCell key={i} day={dayOfMonth - monthInfo.daysInMonth} isCurrentMonth={false} date={date} />);
            } else {
                // Current month's days with events
                const date: DateInfo = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                    day: dayOfMonth,
                };
                cells.push(<MonthlyCalendarCell key={i} day={dayOfMonth} events={eventsPerDayArray[dayOfMonth - 1]} isCurrentMonth={true} date={date} />);
            }
        }

        return cells;
    };

    return (
        <div className="overflow-hidden h-full">
            <div
                className={`grid grid-cols-7 grid-rows-${weeksOfCurrentMonth} h-full w-full`}
                style={{
                    gridTemplateRows: `repeat(${weeksOfCurrentMonth}, minmax(0, 1fr))`, // 행을 균등하게 설정
                }}
            >
                {renderCalendarCells()}
            </div>
        </div>
    );
};
