import React, { useEffect, useRef, useCallback, useState } from "react";
import { WeekdaysHeader } from "./component/WeekdaysHeader";
import { DayCell } from "./component/DayCell";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import {requestMonthlyEvents} from "../../../api/CalendarApi";
import {Cell} from "./component/Cell";
import {DayLine} from "./component/DayLine";

interface WeekInfoInterface {
    daysInMonth: number;
    firstDayOfWeek: number;
    lastDayOfWeek: number;
}

export const WeekCalendar: React.FC = () => {
    const { currentDate, setCurrentDate } = useCalendar();
    const [weekInfo, setWeekInfo] = useState<WeekInfoInterface>({
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

        setCurrentDate(newDate);
        setTimeout(() => {
            setIsScrolling(false);
        }, 3000);
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
        setWeekInfo({
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

    return (
        <div
            ref={containerRef}
            style={{overflow: 'hidden', height: '90%', gridTemplateRows: '20px 1fr'}}
            className="border sm:h-2/3">
            <WeekdaysHeader/>
            <div style={{height: '95%'}} className={`grid grid-cols-7`}>
                {Array.from({length: 7}, (_, index) => {
                    const day = index + 1;
                    const dayEvents = getEventsForDay(day);
                    return (
                        <DayLine key={day} day={day} events={dayEvents}/>
                    );
                })}
            </div>
        </div>
    );
};