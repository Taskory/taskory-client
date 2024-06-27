import React from 'react';
import {useCalendar} from "../../context/CalendarContext";

interface YearCalendarProps {
    setView: (view: string) => void;
}

export const YearCalendar: React.FC<YearCalendarProps> = ({ setView }) => {
    const {currentDate, setCurrentDate} = useCalendar();
    const months = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ];

    const daysInMonth = (month: number) => {
        return new Date(currentDate.getFullYear(), month, 0).getDate();
    };

    const handleMonthClick = (month: string) => {
        setView('month');
        setCurrentDate(new Date(currentDate.getFullYear(), parseInt(month), 0));
    };

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            {months.map((month) => (
                <div key={month} className="p-4 border rounded-lg cursor-pointer" onClick={() => handleMonthClick(month)}>
                    <div className="text-center font-semibold mb-2">{month}</div>
                    <div className="grid grid-cols-7 text-center">
                        {Array.from({ length: daysInMonth(parseInt(month)) }, (_, day) => (
                            <div key={day} className="p-1">
                                {day + 1}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
