import {AllDayRow} from "../common/AllDayRow";
import React from "react";
import {EventSummary} from "../../../api/event/EventsTypes";
import {useScrollBar} from "../context/ScrollBarContext";

interface DailyAllDayRowProps {
    events: EventSummary[]
}

export const DailyAllDayRow: React.FC<DailyAllDayRowProps> = ({events}) => {
    const {scrollBarWidth} = useScrollBar();
    return (
        <>
            <div
                className="sticky top-[6rem] z-10 bg-gray-200 border-b grid grid-cols-timetable"
                style={{paddingRight: scrollBarWidth}}>
                <div className="border-r"/>
                <div className="col-span-7">
                    <AllDayRow events={events}/>
                </div>
            </div>
        </>
    );
};