import {AllDayRow} from "../common/AllDayRow";
import React from "react";
import {EventSummary} from "../../../api/event/EventsTypes";

interface DailyAllDayRowProps {
    scrollBarWidth: number,
    events: EventSummary[]
}

export const DailyAllDayRow: React.FC<DailyAllDayRowProps> = ({scrollBarWidth, events}) => {
    return (
        <>
            <div
                className="sticky top-[6rem] z-10 bg-gray-200 border-b grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] "
                style={{paddingRight: scrollBarWidth}}>
                <div className="border-r"/>
                <div className="col-span-7">
                    <AllDayRow events={events}/>
                </div>
            </div>
        </>
    );
};