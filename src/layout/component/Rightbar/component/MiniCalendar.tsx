import React, {useState} from "react";
import calendarData from "../../../../constants/calendar.json";

export const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = Array.from({ length: days }, (_, index) => index + 1);
    const emptyDays = Array.from({ length: firstDay }, () => null);

    return (
        <div className="mt-2 p-2 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <button onClick={handlePrevMonth} className="btn btn-xs btn-outline">Prev</button>
                <span className="text-sm font-semibold">{currentDate.toLocaleString('default', { month: 'long' })} {year}</span>
                <button onClick={handleNextMonth} className="btn btn-xs btn-outline">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {calendarData.daysOfWeek.map((day, index) => (
                    <div key={day} className={`font-bold text-xs ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-black'}`}>
                        {day}
                    </div>
                ))}
                {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} />
                ))}
                {daysArray.map((day, index) => (
                    <div key={day} className={`p-1 bg-base-100 rounded-lg shadow hover:bg-primary hover:text-white cursor-pointer text-xs ${((index + firstDay) % 7) === 0 ? 'text-red-500' : ((index + firstDay) % 7) === 6 ? 'text-blue-500' : 'text-black'}`}>
                        <div className="grid">
                            <div className="font-bold">{day}</div>
                            {/*<div className="flex justify-end text-xs">2</div>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
