import React from "react";
import {EventSummary} from "../../../api/event/EventsTypes";

interface AllDayRowProps {
    events: EventSummary[]
}

export const AllDayRow: React.FC<AllDayRowProps> = ({events}) => {
    return (
        <>
            <div className="border-r h-16 text-xs">
                {events.map((event, index) => (
                    // TODO: apply event color
                    <div key={index} className="p-1">
                        ● {event.title}
                    </div>
                ))}
            </div>
        </>
    );
};