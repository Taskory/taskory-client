import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { useSpring, animated } from "react-spring";

export const MonthCalendar: React.FC = () => {
    const { firstDayOfWeek, lastDayOfMonth, events, currentDate, setCurrentDate } = useCalendar();
    const containerRef = useRef<HTMLDivElement>(null);
    const [fade, setFade] = useState(true);
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
            }, 300); // This should match the fade-out duration to prevent double scrolling
        }, 300); // This should match the fade-out duration

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            isScrolling.current = false;
            debounceTimeout.current = null;
        }, 300);
    }, [currentDate, setCurrentDate]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    const daysInMonth = lastDayOfMonth.getDate();
    const lastDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth).getDay();
    const emptyEndDays = 6 - lastDayOfWeek;

    return (
        <div ref={containerRef} style={{ overflow: 'hidden' }} className="border">
            <MonthHeader />
            <animated.div style={fadeStyles}>
                <div className="grid grid-cols-7 px-4 py-4">
                    {Array(firstDayOfWeek).fill(null).map((_, index) => (
                        <div key={index} className="border p-2 h-36"></div>
                    ))}
                    {[...Array(daysInMonth)].map((_, index) => {
                        const dayEvents = events.filter((event) => {
                            const eventDate = new Date(event.date);
                            return (
                                eventDate.getFullYear() === currentDate.getFullYear() &&
                                eventDate.getMonth() === currentDate.getMonth() &&
                                eventDate.getDate() === index + 1
                            );
                        });

                        return <Day key={index} day={index + 1} events={dayEvents} />;
                    })}
                    {Array(emptyEndDays).fill(null).map((_, index) => (
                        <div key={daysInMonth + index} className="border p-2 h-36"></div>
                    ))}
                </div>
            </animated.div>
        </div>
    );
};
