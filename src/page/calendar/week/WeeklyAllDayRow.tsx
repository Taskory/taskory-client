import {EventSummary} from "../../../api/event/EventsTypes";
import React from "react";
import {AllDayRow} from "../common/AllDayRow";

interface AllDayRowProps {
    scrollBarWidth: number,
    allDayEvents: EventSummary[][]
}

// Component for the "All day" events row
export const WeeklyAllDayRow: React.FC<AllDayRowProps> = ({ scrollBarWidth, allDayEvents }) => {
    return (
        <div className="sticky top-[6rem] z-10 bg-gray-200 grid grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] border-b" style={{ paddingRight: scrollBarWidth }}>
            <div className="border-r h-8" />
            {allDayEvents.map((events, index) => (
                <AllDayRow key={index} events={events}/>
            ))}
        </div>
    );
};

