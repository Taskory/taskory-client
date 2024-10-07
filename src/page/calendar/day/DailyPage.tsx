import React, {useEffect, useRef, useState} from "react";
import {useCalendar} from "../context/CalendarContext";
import {EventSummary} from "../../../api/event/EventsTypes";
import {getEventsForDate} from "./DailyUtils";
import {TimeColumn} from "../common/TimeColumn";
import {DailyHeader} from "./DailyHedaer";
import {DayColumn} from "../common/DayColumn";
import {DailyAllDayRow} from "./DailyAllDayRow";

export const DailyPage: React.FC = () => {
    const { currentDate, splitEvents } = useCalendar();
    const [eventsUnder24, setEventsUnder24] = useState<EventSummary[]>(getEventsForDate(splitEvents.eventsUnder24, currentDate));
    const [eventsOver24, setEventsOver24] = useState<EventSummary[]>(getEventsForDate(splitEvents.eventsOver24, currentDate));
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollBarWidth ] = useState(0);
    useEffect(() => {
        setEventsUnder24(getEventsForDate(splitEvents.eventsUnder24, currentDate));
        setEventsOver24(getEventsForDate(splitEvents.eventsOver24, currentDate));
    }, [currentDate, splitEvents]);

    return (
        <div className="w-full flex-grow flex flex-col">
            {/* Header Section */}
            <DailyHeader scrollBarWidth={scrollBarWidth}/>

            {/* All day events row */}
            <DailyAllDayRow scrollBarWidth={scrollBarWidth} events={eventsOver24}/>

            {/* Main Content: Time Slots */}
            <div ref={scrollContainerRef}
                 className="flex-grow grid grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] overflow-y-auto">
                {/* Time column */}
                <TimeColumn/>

                {/* columns */}
                <div className="col-span-7">
                    <DayColumn events={eventsUnder24}/>
                </div>
            </div>
        </div>
    );
};