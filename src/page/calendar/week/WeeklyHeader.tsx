import React, {useEffect, useState} from "react";
import calendar from "../../../constants/calendar.json";
import {initializeWeekInfo} from "./WeeklyUtils";
import {useCalendar} from "../context/CalendarContext";
import {useScrollBar} from "../context/ScrollBarContext";

// Header common for weekday names
export const WeeklyHeader: React.FC = () => {
    const {currentDate} = useCalendar();
    const {scrollBarWidth} = useScrollBar();
    const [startDate, setStartDate] = useState<Date>(initializeWeekInfo(currentDate).startSunday);

    useEffect(() => {
        setStartDate(initializeWeekInfo(currentDate).startSunday);
    }, [currentDate]);
    return (
        <div className="sticky top-[4rem] z-10 bg-white grid grid-cols-timetable border-b" style={{ paddingRight: scrollBarWidth }}>
            <div className="border-r" />
            {calendar.daysOfWeek.map((weekdayString, idx) => {
                let textColor = "";
                if (idx === 0) {
                    textColor = "text-red-500"; // 일요일
                } else if (idx === 6) {
                    textColor = "text-blue-500"; // 토요일
                }
                let date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + idx);
                let currentDate = date.getDate();
                return (
                    <div key={idx} className="border-r h-8 flex justify-center items-center font-bold">
                        {/*{currentDate}({weekdayString})*/}
                        <p className={`text-center`}>{currentDate}</p>
                        <p>(</p>
                        <p className={`text-center ${textColor}`}>{weekdayString}</p>
                        <p>)</p>
                    </div>
                );
            })}
        </div>
    );
};
