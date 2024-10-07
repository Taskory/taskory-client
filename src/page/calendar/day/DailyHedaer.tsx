import React from "react";
import {useCalendar} from "../context/CalendarContext";

interface DailyHeaderProps {
    scrollBarWidth: number,
}

// Header common for weekday names
export const DailyHeader: React.FC<DailyHeaderProps> = ({ scrollBarWidth }) => {
    const { currentDate } = useCalendar();
    return (
        <div className="sticky top-[4rem] z-10 bg-white border-b"
             style={{paddingRight: scrollBarWidth}}>
            <div className="border-r"/>
            <div className="border-r h-8 flex justify-center items-center font-bold">
                {/*{currentDate}({weekdayString})*/}
                <p className={`text-center`}>{currentDate.getDate()}</p>
                <p>(</p>
                {/*<p className={`text-center ${textColor}`}>{weekdayString}</p>*/}
                <p>)</p>
            </div>
        </div>
    );
};
