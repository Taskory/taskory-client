import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCalendar} from "../context/CalendarContext";
import monthNames from "../../../constants/calendar.json";

interface CalendarHeaderProps {
    setView: (view: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ setView }) => {
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
        <div className="flex justify-between items-center mb-6 border px-4 py-4 rounded-xl">
            <h1 className="text-2xl font-bold">{`${currentMonthName} ${currentDate.getFullYear()}`}</h1>
            <div className="flex items-center space-x-4">
                <button className="btn" onClick={() => setView('year')}>Year</button>
                <button className="btn" onClick={() => setView('month')}>Month</button>
                <button className="btn" onClick={() => setView('week')}>Week</button>
                <button className="btn" onClick={() => setView('day')}>Day</button>
                <button className="btn btn-primary" onClick={handleAddEvent}>
                    Add event +
                </button>
            </div>
        </div>
    )
}
