import {EventSummary} from "../../../api/event/EventsTypes";
import React from "react";

interface AllDayRowProps {
    scrollBarWidth: number,
    allDayEvents: EventSummary[][]
}

// Component for the "All day" events row
export const AllDayRow: React.FC<AllDayRowProps> = ({ scrollBarWidth, allDayEvents }) => {
    return (
        <div className="sticky top-[6rem] z-10 bg-gray-200 grid grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] border-b" style={{ paddingRight: scrollBarWidth }}>
            <div className="border-r h-8" />
            {allDayEvents.map((events, index) => (
                <div key={index} className="border-r h-16 text-xs">
                    {events.map((event, index) => (
                        // TODO: apply event color
                        <div key={index} className="p-1">
                            ● {event.title}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

