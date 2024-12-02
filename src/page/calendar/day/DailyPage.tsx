import React, {useEffect, useState } from "react";
import {useCalendar} from "../context/CalendarContext";
import {EventSummary} from "../../../api/event/EventsTypes";
import {getEventsForDate} from "./DailyUtils";
import {DailyHeader} from "./DailyHedaer";
import {DailyAllDayRow} from "./DailyAllDayRow";
import {DailyColumn} from "./DailyColumn";
import {TimeTableLayout} from "../common/TimeTableLayout";

export const DailyPage: React.FC = () => {
    const { currentDate, processedEvents } = useCalendar();
    const [eventsUnder24, setEventsUnder24] = useState<EventSummary[]>(getEventsForDate(processedEvents.eventsUnder24, currentDate));
    const [eventsOver24, setEventsOver24] = useState<EventSummary[]>(getEventsForDate(processedEvents.eventsOver24, currentDate));

    useEffect(() => {
        setEventsUnder24(getEventsForDate(processedEvents.eventsUnder24, currentDate));
        setEventsOver24(getEventsForDate(processedEvents.eventsOver24, currentDate));
    }, [currentDate, processedEvents]);

    return (
        <div className="w-full flex-grow flex flex-col">
            {/* All day events row */}
            <DailyAllDayRow events={eventsOver24}/>

            {/* Main Content: Time Table */}
            <TimeTableLayout >
                <DailyColumn events={eventsUnder24} />
            </TimeTableLayout>
        </div>
    );
};
