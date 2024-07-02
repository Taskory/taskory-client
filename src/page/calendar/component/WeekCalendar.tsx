import React, { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { WeekdaysHeader } from "./component/WeekdaysHeader";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import { requestMonthlyEvents } from "../../../api/EventApi";
import { DayLine } from "./component/DayLine";
import {DayCell} from "./component/DayCell";

interface WeekInfoInterface {
    startSunday: number;
    endSaturday: number;
}

export const WeekCalendar: React.FC = () => {
    const { currentDate, setCurrentDate } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>({
        startSunday: currentDate.getDate() - currentDate.getDay(),
        endSaturday: currentDate.getDate() - currentDate.getDay() + 6
    });

    const [events, setEvents] = useState<EventInterface[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();
        if (isScrolling) return;
        setIsScrolling(true);
        const direction = event.deltaY > 0 ? 7 : -7;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + direction);

        setCurrentDate(newDate);
        setTimeout(() => {
            setIsScrolling(false);
        }, 300);
    }, [currentDate, setCurrentDate, isScrolling]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    useEffect(() => {
        setWeekInfo({
            startSunday: currentDate.getDate() - currentDate.getDay(),
            endSaturday: currentDate.getDate() - currentDate.getDay() + 6
        });
        requestMonthlyEvents(currentDate)
            .then((result) => {
                if (result) {
                    setEvents(result);
                }
            });
    }, [currentDate]);

    const getEventsForDay = useCallback((day: number): EventInterface[] => {
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString();
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toISOString();

        return events.filter(event => (
            (event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay)
        ));
    }, [currentDate, events]);

    return (
        <div
            ref={containerRef}
            style={{ overflow: 'hidden', height: '90%', gridTemplateRows: '20px 1fr' }}
            className="border sm:h-2/3">
            <WeekdaysHeader />
            <div style={{ height: '95%' }} className={`grid grid-cols-7`}>
                {/*{Array.from({length: 7}, (_, index) => {*/}
                {/*    const day = weekInfo.startSunday + 1;*/}
                {/*    const dayEvents = getEventsForDay(day);*/}
                {/*    return (*/}
                {/*        <DayLine key={day} day={day} events={dayEvents}/>*/}
                {/*    );*/}
                {/*})}*/}
            </div>
        </div>
    );
};