import {EventSummary} from "../../../api/event/EventsTypes";
import React from "react";
import {AllDayRow} from "../common/AllDayRow";
import {useScrollBar} from "../context/ScrollBarContext";

interface AllDayRowProps {
    allDayEvents: EventSummary[][]
}

// Component for the "All day" events row
export const WeeklyAllDayRow: React.FC<AllDayRowProps> = ({ allDayEvents }) => {
    const {scrollBarWidth} = useScrollBar();

    return (
        <div className="sticky top-[6rem] z-10 bg-gray-200 grid grid-cols-timetable border-b" style={{ paddingRight: scrollBarWidth }}>
            <div className="border-r h-8" />
            {allDayEvents.map((events, index) => (
                <AllDayRow key={index} events={events}/>
            ))}
        </div>
    );
};

