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


    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    const dummyEvents: EventInterface[] = [
        {
            id: 1,
            title: "Team Meeting",
            tag: { id: 1, title: "Work", color: "blue" },
            hashtags: [{ id: 1, title: "#meeting" }],
            description: "Weekly team meeting to discuss project updates.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 0).toISOString(),
            location: "Conference Room A"
        },
        {
            id: 2,
            title: "Code Review",
            tag: { id: 2, title: "Work", color: "green" },
            hashtags: [{ id: 2, title: "#code" }, { id: 3, title: "#review" }],
            description: "Review the latest code commits.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 14, 0).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 15, 0).toISOString(),
            location: "Zoom"
        },
        {
            id: 3,
            title: "Lunch with Client",
            tag: { id: 3, title: "Personal", color: "red" },
            hashtags: [{ id: 4, title: "#lunch" }, { id: 5, title: "#client" }],
            description: "Discuss project requirements with the client.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 12, 30).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 13, 30).toISOString(),
            location: "Restaurant B"
        },
        {
            id: 4,
            title: "Yoga Class",
            tag: { id: 4, title: "Health", color: "purple" },
            hashtags: [{ id: 6, title: "#yoga" }, { id: 7, title: "#fitness" }],
            description: "Attend the weekly yoga class for relaxation.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 18, 0).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 19, 0).toISOString(),
            location: "Gym"
        },
        {
            id: 5,
            title: "Project Deadline",
            tag: { id: 5, title: "Work", color: "orange" },
            hashtags: [{ id: 8, title: "#deadline" }, { id: 9, title: "#project" }],
            description: "Submit the final project deliverables.",
            startDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 17, 0).toISOString(),
            dueDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 23, 59).toISOString(),
            location: "Office"
        }
    ];

    useEffect(() => {
        // requestMonthlyEvents(currentDate)
        //     .then((result) => {
        //         if (result) {
                    setEvents(dummyEvents);
                // }
            // });
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
