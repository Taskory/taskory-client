import React from "react";
import calendar from "../../../../../constants/calendar.json";

export const MonthHeader: React.FC = () => {
    const daysOfWeek = calendar.daysOfWeek;
    return (
        <div className="grid grid-cols-7 gap-4 border px-4 py-4">
            {daysOfWeek.map((day) => (
                <div key={day} className="text-center font-semibold">
                    {day}
                </div>
            ))}
        </div>
    );
}