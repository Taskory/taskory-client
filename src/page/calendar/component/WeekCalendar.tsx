import React, { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { WeekdaysHeader } from "./component/WeekdaysHeader";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import { requestMonthlyEvents } from "../../../api/EventApi";
import { DayLine } from "./component/DayLine";

interface WeekInfoInterface {
    startSunday: Date;
    endSaturday: Date;
}

export const WeekCalendar: React.FC = () => {
    const { currentDate, setCurrentDate } = useCalendar();
    const [events, setEvents] = useState<EventInterface[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const weekInfo: WeekInfoInterface = useMemo(() => ({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
        endSaturday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6)
    }), [currentDate]);

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
        requestMonthlyEvents(currentDate)
            .then((result) => {
                if (result) {
                    setEvents(result);
                }
            });
    }, [currentDate]);

    const getEventsForDay = useCallback((date: Date): EventInterface[] => {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();

        return events.filter(event => (
            (event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay)
        ));
    }, [events]);

    function renderDayLines() {
        return <>
            {Array.from({length: 7}, (_, index) => {
                const date = new Date(weekInfo.startSunday.getFullYear(), weekInfo.startSunday.getMonth(), weekInfo.startSunday.getDate() + index);
                const day = date.getDate();
                const dayEvents = getEventsForDay(date);
                return (
                    <DayLine key={day} day={day} events={dayEvents}/>
                );
            })}
        </>;
    }

    return (
        <div
            ref={containerRef}
            style={{overflow: 'hidden', height: '90%', gridTemplateRows: '20px 1fr'}}
            className="border sm:h-2/3">
            <WeekdaysHeader/>
            <div style={{height: '95%'}} className={`grid grid-cols-7`}>
                {renderDayLines()}
            </div>
        </div>
    );
};
