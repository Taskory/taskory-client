import React, {useEffect, useRef, useCallback, useState} from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { useSpring, animated } from "react-spring";

export const MonthCalendar: React.FC = () => {
    const { firstDayOfWeek, lastDayOfMonth, events, currentDate, setCurrentDate } = useCalendar();
    const containerRef = useRef<HTMLDivElement>(null);
    const [ableScroll, setAbleScroll] = useState<boolean>(true);
    const [{ x }] = useSpring(() => ({ x: 0 }));

    const handleWheel = useCallback((event: WheelEvent) => {
        if (ableScroll) {
            setAbleScroll(false);
            event.preventDefault(); // Prevent the default wheel behavior
            setTimeout(() => {
                if (event.deltaY < -10) {
                    // Scroll up
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                } else if (event.deltaY > 10) {
                    // Scroll down
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                }
            }, 500);
        }
        setAbleScroll(true);
    }, [currentDate, setCurrentDate]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    return (
        <animated.div ref={containerRef} style={{ x }}>
            <MonthHeader />
            <div className="grid grid-cols-7 gap-4 border px-4 py-4">
                {Array(firstDayOfWeek).fill(null).map((_, index) => (
                    <div key={index} className="border p-2 h-32"></div>
                ))}
                {[...Array(lastDayOfMonth.getDate())].map((_, index) => {
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
            </div>
        </animated.div>
    );
};
