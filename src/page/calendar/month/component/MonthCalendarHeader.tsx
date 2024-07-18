import React from "react";
import calendar from "../../../../constants/calendar.json";

export const MonthCalendarHeader: React.FC = () => {
    const daysOfWeek = calendar.daysOfWeek;
    return (
        <div className="grid grid-cols-7 bg-gray-100">
            {daysOfWeek.map((day, idx) => {
                let textColor = "";
                if (idx === 0) {
                    textColor = "text-red-500"; // 일요일
                } else if (idx === 6) {
                    textColor = "text-blue-500"; // 토요일
                }
                return (
                    <div key={day} className={`text-center font-semibold ${textColor}`}>
                        {day}
                    </div>
                );
            })}
        </div>
    );
};
