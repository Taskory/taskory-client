import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCalendar} from "../context/CalendarContext";
import monthNames from "../../../constants/calendar.json";
import {useCalendarView} from "../context/CalendarViewContext";


export const CalendarHeader: React.FC = () => {
    const {view, setView} = useCalendarView();
    const navigate = useNavigate();
    const {currentDate, goToNext, goToPrev} = useCalendar();
    const [currentMonthName, setCurrentMonthName] = useState(monthNames.monthNames[currentDate.getMonth()]);

    const handleAddEvent = () => {
        navigate('/add-event');
    };

    useEffect(() => {
        setCurrentMonthName(monthNames.monthNames[currentDate.getMonth()]);
    }, [currentDate]);

    const formatDate = () => {
        const year = currentDate.getFullYear();
        const month = currentMonthName;
        const day = currentDate.getDate();

        switch(view) {
            case 'year':
                return `${year}`;
            case 'month':
                return `${year} ${month}`;
            case 'week': {
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const endOfWeek = new Date(currentDate);
                endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
                const startMonth = monthNames.monthNames[startOfWeek.getMonth()];
                const endMonth = monthNames.monthNames[endOfWeek.getMonth()];
                return `${year} ${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
            }
            case 'day':
                return `${year} ${month} ${day}`;
            default:
                return `${year} ${month} ${day}`;
        }
    };

    return (
        <div className="flex justify-between items-center p-4 min-h-headerHeight h-full">
            <h1 className="text-xl font-bold">{formatDate()}</h1>
            <button className="btn btn-sm" onClick={() => goToPrev(view)}>Previous</button>
            <button className="btn btn-sm" onClick={() => goToNext(view)}>Next</button>
            <div className="flex items-center space-x-4">
                <select
                    className="btn btn-sm"
                    onChange={(e) => setView(e.target.value)}
                    value={view}
                >
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                </select>
                <button className="btn btn-sm btn-primary" onClick={handleAddEvent}>
                    Add event +
                </button>
            </div>
        </div>
    )
}
