import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { EventInterface } from "../../../../api/interface/EventInterface";
import { EmptyCells } from "./component/EmptyCells";
// import { requestMonthlyEvents } from "../../../../api/CalendarApi";

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

    const tempEvents: EventInterface[] = [
        // event happens through multiple months
        {
            id: 1,
            title: 'Daily Standup',
            tag: { id: 1, title: 'Meeting', color: 'RED' },
            hashtags: [{ id: 1, title: '#daily' }, { id: 2, title: '#standup' }],
            description: 'Daily team sync-up meeting',
            startDateTime: '2024-06-21T08:00:00',
            dueDateTime: '2024-07-01T08:30:00',
            location: 'Conference Room A'
        },
        // event happens through multiple months
        {
            id: 2,
            title: 'Project Planning',
            tag: { id: 2, title: 'Workshop', color: 'ORANGE' },
            hashtags: [{ id: 3, title: '#project' }, { id: 4, title: '#planning' }],
            description: 'Planning session for the new project',
            startDateTime: '2024-05-02T10:00:00',
            dueDateTime: '2024-07-04T11:30:00',
            location: 'Conference Room B'
        },
        // event for a single day
        {
            id: 3,
            title: 'Design Review',
            tag: { id: 3, title: 'Review', color: 'YELLOW' },
            hashtags: [{ id: 5, title: '#design' }, { id: 6, title: '#review' }],
            description: 'Review of the new design mockups',
            startDateTime: '2024-06-17T13:00:00',
            dueDateTime: '2024-06-17T14:00:00',
            location: 'Conference Room C'
        },
        {
            id: 4,
            title: 'A Project',
            tag: { id: 3, title: 'Review', color: 'YELLOW' },
            hashtags: [{ id: 5, title: '#design' }, { id: 6, title: '#review' }],
            description: 'Review of the new design mockups',
            startDateTime: '2024-06-12T13:00:00',
            dueDateTime: '2024-06-16T14:00:00',
            location: 'Conference Room C'
        }
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);
    const debounceTimeout = useRef<number | null>(null);

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();

        if (isScrolling.current) return;

        isScrolling.current = true;
        const direction = event.deltaY > 0 ? 1 : -1;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);

        setTimeout(() => {
            setCurrentDate(newDate);
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
        // requestMonthlyEvents(currentDate.getMonth().toString())
        //     .then((result) => {
        //         setEvents(result);
        //     });

        setEvents(tempEvents);
    }, [currentDate]);

    const getEventsForDay = (day: number): EventInterface[] => {
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString();
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toISOString();

        return events.filter(event => (
            (event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay)
        ));
    };

    return (
        <div ref={containerRef} style={{ overflow: 'hidden' }} className="border">
            <MonthHeader />
            <div className="grid grid-cols-7 px-4 py-4">
                <EmptyCells count={monthInfo.firstDayOfWeek} startIndex={0} />
                {Array.from({ length: monthInfo.daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const dayEvents = getEventsForDay(day);
                    return (
                        <Day key={day} day={day} events={dayEvents} />
                    );
                })}
                <EmptyCells count={6 - monthInfo.lastDayOfWeek} startIndex={monthInfo.daysInMonth} />
            </div>
        </div>
    );
};
