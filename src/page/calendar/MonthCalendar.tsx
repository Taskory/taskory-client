import React, { useEffect, useRef, useState } from "react";
import { MonthCalendarHeader } from "./component/MonthCalendarHeader";
import { DayCell } from "./component/DayCell";
import { useCalendar } from "./context/CalendarContext";
import { Cell } from "./component/Cell";
import { MonthInfoInterface } from "./interface/MonthCalendarInterfaces";
import { getMonthlyEvents } from "./util/MonthCalendarUtils";

export const MonthCalendar: React.FC = () => {
    const { currentDate, originEvents } = useCalendar();
    const [monthlyEvents, setMonthlyEvents] = useState(getMonthlyEvents(originEvents, currentDate));
    const [monthInfo, setMonthInfo] = useState<MonthInfoInterface>({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
    });

    const containerRef = useRef<HTMLDivElement>(null);

    /*
    * UseEffects
    * */
    useEffect(() => {
        setMonthInfo({
            daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
            firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
            lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
        });
    }, [currentDate]);

    useEffect(() => {
        setMonthlyEvents(getMonthlyEvents(originEvents, currentDate));
    }, [originEvents, currentDate]);

    /**/

    const weeksOfCurrentMonth = (): number => {
        const countOfCells: number = (
            monthInfo.firstDayOfWeek
            + monthInfo.daysInMonth
            + (6 - monthInfo.lastDayOfWeek)
        );
        return Math.ceil(countOfCells / 7);
    };

    /*
    * rendering function
    * */
    function renderDayCells() {
        return <>
            {monthlyEvents.map((events, index) => {
                const day: number = index + 1;
                return (
                    <DayCell key={day} day={day} events={events} />
                );
            })}
        </>;
    }

    function renderEmptyCells(count: number, startIndex: number, previousMonth: boolean) {
        const days: number[] = [];
        if (previousMonth) {
            const prevMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            const prevMonthDays: number = prevMonthDate.getDate();
            for (let i = 0; i < count; i++) {
                const day: number = prevMonthDays - count + i + 1;
                days.push(day);
            }
        } else {
            for (let i = 1; i <= count; i++) {
                days.push(i);
            }
        }
        return (
            <>
                {days.map((day, index) => (
                    <Cell key={startIndex + index} className="h-full w-full bg-gray-50">
                        <div className="text-left ml-2 mt-1 h-full row-span-1">{day}</div>
                    </Cell>
                ))}
            </>
        );
    }
    /**/

    return (
        <div
            ref={containerRef}
            style={{ overflow: 'hidden', gridTemplateRows: '20px 1fr' }}
            className="border h-full">
            <MonthCalendarHeader />
            <div className={`grid grid-cols-7 grid-rows-${weeksOfCurrentMonth()} h-full`}>
                {renderEmptyCells(monthInfo.firstDayOfWeek, 0, true)}
                {renderDayCells()}
                {renderEmptyCells(6 - monthInfo.lastDayOfWeek, monthInfo.daysInMonth + 1, false)}
            </div>
        </div>
    );
};
