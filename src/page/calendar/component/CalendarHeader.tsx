import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCalendar} from "../context/CalendarContext";
import monthNames from "../../../constants/calendar.json";
import {useCalendarView} from "../context/CalendarViewContext";


export const CalendarHeader: React.FC = () => {
    const {view, setView} = useCalendarView();
    const navigate = useNavigate();
    const {currentDate} = useCalendar();
    const [currentMonthName, setCurrentMonthName] = useState(monthNames.monthNames[currentDate.getMonth()]);

    const handleAddEvent = () => {
        navigate('/add-event');
    };

    useEffect(() => {
        setCurrentMonthName(monthNames.monthNames[currentDate.getMonth()]);
    }, [currentDate]);

    return (
        <div className="flex justify-between items-center border-r px-4 py-4">
            <h1 className="text-2xl font-bold">{`${currentMonthName} ${currentDate.getFullYear()}`}</h1>
            <div className="flex items-center space-x-4">
                <select
                    className="btn"
                    onChange={(e) => setView(e.target.value)}
                    value={view}
                >
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                </select>
                <button className="btn btn-primary" onClick={handleAddEvent}>
                    Add event +
                </button>
            </div>
        </div>
    )
}
