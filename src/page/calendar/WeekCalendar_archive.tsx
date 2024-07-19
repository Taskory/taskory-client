import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useCalendar } from "./context/CalendarContext";
import { EventInterface } from "../../api/interface/EventInterface";
import { WeekCalendarHeader } from "./component/WeekCalendarHeader";
import { useTestData } from "./context/TestDataContext";

interface WeekInfoInterface {
    startSunday: Date;
}

interface EventComponentProps {
    event: EventInterface;
    start: Date;
    end: Date;
    left: string;
    width: string;
}

const Event: React.FC<EventComponentProps> = ({ event, start, end, left, width }) => {
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const eventDuration = endHour - startHour;

    const top = `${(startHour / 24) * 100}`;
    const height = `${(eventDuration / 24) * 100}`;

    return (
        <div
            className={`absolute p-1 text-xs text-center content-center bg-${event.tag.color.toLowerCase()}-100`}
            style={{ top: `${top}%`, left: `${left}%`, width: `${width}%`, height: `${height}%` }}
        >
            <div
                className="absolute left-0 top-0 h-full"
                style={{ width: '4px', backgroundColor: `${event.tag.color.toLowerCase()}` }}
            ></div>
            <div className="pl-4">{event.title}</div>
        </div>
    );
};

export const WeekCalendar: React.FC = () => {
    const { currentDate } = useCalendar();
    const { dummyEvents } = useTestData();
    const [events, setEvents] = useState<EventInterface[]>([]);

    const weekInfo: WeekInfoInterface = useMemo(() => ({
        startSunday: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
    }), [currentDate]);

    useEffect(() => {
        setEvents(dummyEvents);
    }, [dummyEvents]);

    const getEventsForDay = useCallback((date: Date) => {
        const overlappingEvents: EventInterface[] = [];
        const nonOverlappingEvents: EventInterface[] = [];
        const allDayEvents: EventInterface[] = [];

        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        events.forEach(event => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            if (eventStart <= endOfDay && eventEnd >= startOfDay) {
                if (eventStart <= startOfDay && eventEnd >= endOfDay) {
                    allDayEvents.push(event);
                } else {
                    const isOverlapping = events.some(otherEvent => {
                        if (otherEvent === event) return false;
                        const otherStart = new Date(otherEvent.startDateTime);
                        const otherEnd = new Date(otherEvent.dueDateTime);
                        return (
                            (eventStart < otherEnd && eventEnd > otherStart) || // overlaps with other event
                            (eventStart < otherEnd && eventEnd > otherStart)   // overlaps with other event
                        );
                    });
                    if (isOverlapping) {
                        overlappingEvents.push(event);
                    } else {
                        nonOverlappingEvents.push(event);
                    }
                }
            }
        });

        return { overlappingEvents, nonOverlappingEvents, allDayEvents };
    }, [events]);

    const calculateOverlaps = (events: EventInterface[]) => {
        const eventCount = events.length;
        const overlaps: { [key: number]: { itemCount: number; itemPosition: number } } = {};
        const sortedEvents = [...events].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

        sortedEvents.forEach((event, index) => {
            overlaps[index] = { itemCount: eventCount, itemPosition: 0 };

            let currentItemPosition = 0;

            for (let i = 0; i < index; i++) {
                const comparedEventStart = new Date(sortedEvents[i].startDateTime).getTime();
                const comparedEventEnd = new Date(sortedEvents[i].dueDateTime).getTime();
                const eventStart = new Date(event.startDateTime).getTime();
                const eventEnd = new Date(event.dueDateTime).getTime();

                if (
                    (eventStart >= comparedEventStart && eventStart < comparedEventEnd) ||
                    (eventEnd > comparedEventStart && eventEnd <= comparedEventEnd) ||
                    (eventStart <= comparedEventStart && eventEnd >= comparedEventEnd)
                ) {
                    currentItemPosition = currentItemPosition + 1;
                }
            }
            overlaps[index].itemPosition = currentItemPosition;
        });

        return overlaps;
    };


    const splitEventsByDay = useCallback((events: EventInterface[], date: Date) => {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        return events.map(event => {
            const eventStart = new Date(event.startDateTime);
            const eventEnd = new Date(event.dueDateTime);

            // 이벤트 시작과 종료 시간을 각각 일별로 잘라내기
            const start = eventStart < startOfDay ? startOfDay : eventStart;
            const end = eventEnd > endOfDay ? endOfDay : eventEnd;

            return { ...event, start, end };
        });
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <WeekCalendarHeader startDate={weekInfo.startSunday} />
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                    {Array.from({ length: 24 }, (_, hour) => (
                        <div key={hour}
                             className="h-[50px] border-t border-gray-200 flex items-start justify-end pr-1 text-xs">
                            {hour}:00
                        </div>
                    ))}
                </div>
                <div className="w-[90%] grid grid-cols-7 border-l border-gray-200">
                    {Array.from({ length: 7 }, (_, index) => {
                        const date = new Date(weekInfo.startSunday.getFullYear(), weekInfo.startSunday.getMonth(), weekInfo.startSunday.getDate() + index);
                        const { overlappingEvents, nonOverlappingEvents, allDayEvents } = getEventsForDay(date);

                        const splitOverlappingEvents = splitEventsByDay(overlappingEvents, date);
                        const splitNonOverlappingEvents = splitEventsByDay(nonOverlappingEvents, date);

                        const overlaps = calculateOverlaps(splitOverlappingEvents);

                        return (
                            <div key={index} className="relative border-r border-gray-200 h-full">
                                <div className="absolute w-full h-full">
                                    {splitOverlappingEvents.map((event, idx) => {
                                        const { itemCount, itemPosition } = overlaps[idx];
                                        const left = (itemPosition / itemCount) * 100;
                                        const width = 100 - left ;
                                        return (
                                            <Event
                                                key={idx}
                                                event={event}
                                                start={event.start}
                                                end={event.end}
                                                left={`${left}`}
                                                width={`${width}`}
                                            />
                                        );
                                    })}
                                    {splitNonOverlappingEvents.map((event, idx) => {
                                        return (
                                            <Event
                                                key={`non-${idx}`}
                                                event={event}
                                                start={event.start}
                                                end={event.end}
                                                left={'0'}
                                                width={'100'}
                                            />
                                            )
                                    })}
                                </div>
                                {Array.from({ length: 24 }, (_, hour) => (
                                    <div key={hour} className="h-[50px] border-t border-gray-200"></div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
