import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthCalendarHeader } from "./component/MonthCalendarHeader";
import { DayCell } from "./component/DayCell";
import { useCalendar } from "./context/CalendarContext";
import { Cell } from "./component/Cell";
import {MonthInfoInterface} from "./interface/MonthCalendarInterfaces";
import {getMonthlyEvents} from "./util/MonthCalendarUtils";

export const MonthCalendar: React.FC = () => {
    const { currentDate, setCurrentDate, originEvents } = useCalendar();
    const [monthlyEvents, setMonthlyEvents] = useState(getMonthlyEvents(originEvents, currentDate));
    const [monthInfo, setMonthInfo] = useState<MonthInfoInterface>({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const [enableDateUpdate, setEnableDateUpdate] = useState<boolean>(true);
    const [scrollDirection, setScrollDirection] = useState<number>(0);  // 1 for down, -1 for up, and 0 for fixed
    const [scrollAmount, setScrollAmount] = useState<number>(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleWheel: (event: WheelEvent) => void = useCallback((event: WheelEvent) => {
        event.preventDefault();
        setScrollDirection(event.deltaY > 0 ? 1 : -1);
        setScrollAmount(event.deltaY);

        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setEnableDateUpdate(true);
        }, 100);
    }, []);

    /*
    * UseEffects
    * */
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    useEffect(() => {
        setMonthInfo({
            daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
            firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
            lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
        })
    }, [currentDate]);

    useEffect(() => {
        if (enableDateUpdate) {
            const newDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + scrollDirection, 1);
            setCurrentDate(newDate);
            setEnableDateUpdate(false);
        }
    }, [currentDate, enableDateUpdate, scrollDirection, setCurrentDate, scrollAmount]);

    useEffect(() => {
        if (!enableDateUpdate) setScrollAmount(0);
    }, [enableDateUpdate]);

    useEffect(() => {
        setMonthlyEvents(getMonthlyEvents(originEvents, currentDate));
    }, [originEvents]);
    /**/



    const weeksOfCurrentMonth = (): number => {
        const countOfCells: number = (
            monthInfo.firstDayOfWeek
            + monthInfo.daysInMonth
            + 6 - monthInfo.lastDayOfWeek
        );
        return countOfCells / 7;
    };

    /*
    * rendering function
    * */
    function renderDayCells() {
        return <>
            {monthlyEvents.map((events, index) => {
                const day: number = index + 1;
                return (
                    <DayCell key={day} day={day} events={events}/>
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
                {renderEmptyCells(6 - monthInfo.lastDayOfWeek, monthInfo.daysInMonth, false)}
            </div>
        </div>
    );
};
