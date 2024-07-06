import React from "react";
import calendar from "../../../../constants/calendar.json";

interface WeekCalendarHeaderProps {
    startDate: Date
}

export const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({startDate}) => {
    const daysOfWeek = calendar.daysOfWeek;
    return (
        <>
            <div className="grid grid-cols-8 bg-gray-100 w-full flex-none ">
                <div className="w-20 bg-gray-100"/>
                {daysOfWeek.map((weekdayString, idx) => {
                    let textColor = "";
                    if (idx === 0) {
                        textColor = "text-red-500"; // 일요일
                    } else if (idx === 6) {
                        textColor = "text-blue-500"; // 토요일
                    }
                    let date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + idx);
                    let currentDate = date.getDate();
                    return (
                        <div key={idx} className="flex font-semibold justify-center">
                            <p className={`text-center`}>{currentDate}</p>
                            <p>(</p>
                            <p className={`text-center ${textColor}`}>{weekdayString}</p>
                            <p>)</p>
                        </div>
                    );
                })}
            </div>
        </>

    );
};
