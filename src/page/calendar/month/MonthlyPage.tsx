// MonthlyPage.tsx
import React, { useEffect, useState } from "react";
import { MonthlyCalendarCell } from "./MonthlyCalendarCell";
import { MonthlyHeader } from "./MonthlyHeader";
import { useCalendar } from "../context/CalendarContext";
import { getMonthlyEvents } from "./MonthlyUtils";

export const MonthlyPage: React.FC = () => {
    const { currentDate, originEvents } = useCalendar();
    const [monthlyEvents, setMonthlyEvents] = useState(getMonthlyEvents(originEvents, currentDate));
    const [monthInfo, setMonthInfo] = useState({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
    });

    useEffect(() => {
        setMonthInfo({
            daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
            firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        });
        setMonthlyEvents(getMonthlyEvents(originEvents, currentDate));
    }, [currentDate, originEvents]);

    const weeksOfCurrentMonth = Math.ceil((monthInfo.firstDayOfWeek + monthInfo.daysInMonth) / 7);

    const renderCalendarCells = () => {
        const totalCells = weeksOfCurrentMonth * 7;
        const cells = [];
        const previousMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        for (let i = 0; i < totalCells; i++) {
            const dayOfMonth = i - monthInfo.firstDayOfWeek + 1;
            if (i < monthInfo.firstDayOfWeek) {
                // Previous month's days
                cells.push(<MonthlyCalendarCell key={i} day={previousMonthDays - monthInfo.firstDayOfWeek + i + 1} isCurrentMonth={false} />);
            } else if (dayOfMonth > monthInfo.daysInMonth) {
                // Next month's days
                cells.push(<MonthlyCalendarCell key={i} day={dayOfMonth - monthInfo.daysInMonth} isCurrentMonth={false} />);
            } else {
                // Current month's days with events
                cells.push(<MonthlyCalendarCell key={i} day={dayOfMonth} events={monthlyEvents[dayOfMonth - 1]} isCurrentMonth={true} />);
            }
        }

        return cells;
    };

    return (
        <div className="overflow-hidden h-full">
            <MonthlyHeader />
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
