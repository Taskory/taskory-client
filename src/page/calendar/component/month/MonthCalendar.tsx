import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthHeader } from "./component/MonthHeader";
import { Day } from "./component/Day";
import { useCalendar } from "../../context/CalendarContext";
import { useSpring, animated } from "react-spring";
import { EventInterface } from "../../../../api/interface/EventInterface";
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
    const [events, setEvents] = useState<EventInterface[]>([
        // event happens through multiple month
        {
            id: 1,
            title: 'Daily Standup',
            tag: { id: 1, title: 'Meeting', color: 'RED'},
            hashtags: [{ id: 1, title: '#daily' }, { id: 2, title: '#standup' }],
            description: 'Daily team sync-up meeting',
            startDateTime: '2024-06-21T08:00:00',
            dueDateTime: '2024-07-01T08:30:00',
            location: 'Conference Room A'
        },
        // event happens through multiple month
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
        // event for single day
        {
            id: 3,
            title: 'Design Review',
            tag: { id: 3, title: 'Review', color: 'YELLOW' },
            hashtags: [{ id: 5, title: '#design' }, { id: 6, title: '#review' }],
            description: 'Review of the new design mockups',
            startDateTime: '2024-07-17T13:00:00',
            dueDateTime: '2024-07-17T14:00:00',
            location: 'Conference Room C'
        },

        ////////////////////////////
        // This mock data makes an error
        // : Cannot read properties of undefined (reading 'push')
        // // event for single day (last day of a month)
        // {
        //     id: 4,
        //     title: 'Client Meeting',
        //     tag: { id: 1, title: 'Meeting', color: 'GREEN' },
        //     hashtags: [{ id: 7, title: '#client' }, { id: 8, title: '#requirements' }],
        //     description: 'Meeting with the client to discuss requirements',
        //     startDateTime: '2024-07-31T15:00:00',
        //     dueDateTime: '2024-07-31T16:30:00',
        //     location: 'Client Office'
        // },
        // // event for single day (last day of Feburary)
        // {
        //     id: 5,
        //     title: 'Team Drinks',
        //     tag: { id: 4, title: 'Social', color: 'BLUE' },
        //     hashtags: [{ id: 9, title: '#team' }, { id: 10, title: '#drinks' }],
        //     description: 'Social event with the team',
        //     startDateTime: '2024-02-29T17:00:00',
        //     dueDateTime: '2024-02-29T19:00:00',
        //     location: 'Local Bar'
        // }
    ]);

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
        // requestMonthlyEvents(currentDate.getMonth().toString())
        //     .then((result) => {
        //         setEvents(result);
        //     });
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
            <animated.div style={fadeStyles}>
                <div className="grid grid-cols-7 px-4 py-4">
                    <EmptyCells count={monthInfo.firstDayOfWeek} startIndex={0} />
                    {eventsByDay.map((dayEvents, index) => (
                        <Day key={index + 1} day={index + 1} events={dayEvents} />
                    ))}
                    <EmptyCells count={6 - monthInfo.lastDayOfWeek} startIndex={monthInfo.daysInMonth} />
                </div>
            </animated.div>
        </div>
    );
};

interface EmptyCellsProps {
    count: number;
    startIndex: number;
}

const EmptyCells: React.FC<EmptyCellsProps> = ({ count, startIndex }) => {
    return (
        <>
            {Array(count).fill(null).map((_, index) => (
                <div key={startIndex + index} className="border p-2 h-36"></div>
            ))}
        </>
    );
};