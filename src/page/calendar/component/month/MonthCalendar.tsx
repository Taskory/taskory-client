import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { useSpring, animated } from "react-spring";
import { EventInterface } from "../../../../api/interface/EventInterface";

interface MonthInfoInterface {
    daysInMonth: number;
    firstDayOfWeek: number;
    lastDayOfWeek: number;
}

export const MonthCalendar: React.FC = () => {
    const { events, currentDate, setCurrentDate } = useCalendar();
    const [monthInfo, setMonthInfo] = useState<MonthInfoInterface>({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const [fade, setFade] = useState<boolean>(true);
    const isScrolling = useRef(false);
    const debounceTimeout = useRef<number | null>(null);

    const fadeStyles = useSpring({
        opacity: fade ? 1 : 0,
        config: { duration: 100 },
    });

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();

        if (isScrolling.current) return;

        isScrolling.current = true;
        const direction = event.deltaY > 0 ? 1 : -1;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);

        setFade(false);

        setTimeout(() => {
            setCurrentDate(newDate);
            setFade(true);
            setTimeout(() => {
                isScrolling.current = false;
            }, 1000);
        }, 10);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            isScrolling.current = false;
            debounceTimeout.current = null;
        }, 300);
    }, [currentDate, setCurrentDate]);

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


    const emptyEndDays = 6 - monthInfo.lastDayOfWeek;

    const getEventDays = (event: EventInterface): number[] => {
        const start = new Date(event.startDateTime);
        const end = new Date(event.dueDateTime);
        const days: number[] = [];

        const startDay = start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear() ? start.getDate() : 0;
        const endDay = end.getMonth() === currentDate.getMonth() && end.getFullYear() === currentDate.getFullYear() ? end.getDate() : 0;

        // event started from the previous month
        if (startDay === 0 && endDay !== 0) {
            for (let day = 1; day <= endDay; day++) {
                days.push(day);
            }

            // event will continue to the next month
        } else if (startDay !== 0 && endDay === 0) {
            for (let day = startDay; day <= monthInfo.daysInMonth; day++) {
                days.push(day);
            }

            // event started from the previous month, and will continue till next month
        } else if (startDay === 0 && endDay === 0) {
            if ( (start.getMonth()-end.getMonth()) * currentDate.getMonth() < 0){
                for (let day = 1; day <= monthInfo.daysInMonth; day++) {
                    days.push(day);
                }
            }

            // event starts and ends on the current month
        } else {
            for (let day = startDay; day <= endDay; day++) {
                days.push(day);
            }
        }

        return days;
    };

    const eventsByDay = Array.from({ length: monthInfo.daysInMonth }, () => [] as EventInterface[]);
    events.forEach((event: EventInterface) => {
        const eventDays = getEventDays(event);
        eventDays.forEach(day => {
            eventsByDay[day - 1].push(event);
        });
    });

    return (
        <div ref={containerRef} style={{ overflow: 'hidden' }} className="border">
            <MonthHeader />
            <animated.div style={fadeStyles}>
                <div className="grid grid-cols-7 px-4 py-4">
                    {Array(monthInfo.firstDayOfWeek).fill(null).map((_, index) => (
                        <div key={index} className="border p-2 h-36"></div>
                    ))}
                    {eventsByDay.map((dayEvents, index) => (
                        <Day key={index + 1} day={index + 1} events={dayEvents} />
                    ))}
                    {Array(emptyEndDays).fill(null).map((_, index) => (
                        <div key={monthInfo.daysInMonth + index} className="border p-2 h-36"></div>
                    ))}
                </div>
            </animated.div>
        </div>
    );
};