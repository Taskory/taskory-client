import React from "react";
import {useNavigate} from "react-router-dom";
import {currentMonthName, currentYear} from "../util/CalendarUtil";

export const CalendarHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleAddEvent = () => {
        navigate('/add-event');
    };
    return (
        <div className="flex justify-between items-center mb-6 border px-4 py-4 rounded-xl">
            <h1 className="text-2xl font-bold">{`${currentMonthName} ${currentYear}`}</h1>
            <div className="flex items-center">
                <button className="btn btn-primary" onClick={handleAddEvent}>
                    Add event +
                </button>
            </div>
        </div>
    )
}