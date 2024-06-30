import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { EventInterface } from "../../../../api/interface/EventInterface";
import {EmptyCells} from "./component/EmptyCells";
// import {requestMonthlyEvents} from "../../../../api/CalendarApi";

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
        // event happens through multiple month
        {
            id: 1,
            title: 'Daily Standup',
            tag: {id: 1, title: 'Meeting', color: 'RED'},
            hashtags: [{id: 1, title: '#daily'}, {id: 2, title: '#standup'}],
            description: 'Daily team sync-up meeting',
            startDateTime: '2024-06-21T08:00:00',
            dueDateTime: '2024-07-01T08:30:00',
            location: 'Conference Room A'
        },
        // event happens through multiple month
        {
            id: 2,
            title: 'Project Planning',
            tag: {id: 2, title: 'Workshop', color: 'ORANGE'},
            hashtags: [{id: 3, title: '#project'}, {id: 4, title: '#planning'}],
            description: 'Planning session for the new project',
            startDateTime: '2024-05-02T10:00:00',
            dueDateTime: '2024-07-04T11:30:00',
            location: 'Conference Room B'
        },
        // event for single day
        {
            id: 3,
            title: 'Design Review',
            tag: {id: 3, title: 'Review', color: 'YELLOW'},
            hashtags: [{id: 5, title: '#design'}, {id: 6, title: '#review'}],
            description: 'Review of the new design mockups',
            startDateTime: '2024-06-17T13:00:00',
            dueDateTime: '2024-06-17T14:00:00',
            location: 'Conference Room C'
        },
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
                <div className="grid grid-cols-7 px-4 py-4">
                    <EmptyCells count={monthInfo.firstDayOfWeek} startIndex={0} />
                    {eventsByDay.map((dayEvents, index) => (
                        <Day key={index + 1} day={index + 1} events={dayEvents} />
                    ))}
                    <EmptyCells count={6 - monthInfo.lastDayOfWeek} startIndex={monthInfo.daysInMonth} />
                </div>
        </div>
    );
};