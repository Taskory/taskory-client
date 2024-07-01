import React, { useEffect, useRef, useCallback, useState } from "react";
import { WeekdaysHeader } from "./component/WeekdaysHeader";
import { DayCell } from "./component/DayCell";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import { EmptyCells } from "./component/EmptyCells";
import {requestMonthlyEvents} from "../../../api/CalendarApi";

interface MonthInfoInterface {
    daysInMonth: number;
    firstDayOfWeek: number;
    lastDayOfWeek: number;
}

export const MonthCalendar: React.FC = () => {
    const { currentDate, setCurrentDate } = useCalendar();
    const [monthInfo, setMonthInfo] = useState<MonthInfoInterface>({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
    });

    const [events, setEvents] = useState<EventInterface[]>([]);


    const containerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();
        if (isScrolling) return;
        setIsScrolling(true);
        const direction = event.deltaY > 0 ? 1 : -1;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);

        setTimeout(() => {
            setCurrentDate(newDate);
            setIsScrolling(false);
        }, 300);
    }, [currentDate, setCurrentDate, isScrolling]);

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
        requestMonthlyEvents(currentDate)
            .then((result) => {
                if (result) {
                    setEvents(result);
                }
            });

    }, [currentDate]);

    const getEventsForDay = (day: number): EventInterface[] => {
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString();
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toISOString();

        return events.filter(event => (
            (event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay)
        ));
    };

    const weeksOfCurrentMonth = (): number => {
        const countOfCells = (
            monthInfo.firstDayOfWeek
            + monthInfo.daysInMonth
            + 6 - monthInfo.lastDayOfWeek
        );
        return countOfCells/7;
    };

    return (
        <div 
            ref={containerRef} 
            style={{ overflow: 'hidden', height: '90%', gridTemplateRows: '20px 1fr'}} 
            className="border sm:h-2/3">
            <WeekdaysHeader/>
            <div  style={{height: '95%'}} className={`grid grid-cols-7 grid-rows-${weeksOfCurrentMonth()}`}>
                <EmptyCells count={monthInfo.firstDayOfWeek} startIndex={0} />
                {Array.from({ length: monthInfo.daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const dayEvents = getEventsForDay(day);
                    return (
                        <DayCell key={day} day={day} events={dayEvents}/>
                    );
                })}
                <EmptyCells count={6 - monthInfo.lastDayOfWeek} startIndex={monthInfo.daysInMonth}/>
            </div>
        </div>
    );
};
