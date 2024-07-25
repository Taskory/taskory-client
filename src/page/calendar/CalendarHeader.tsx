import React, { useEffect, useRef, useState } from "react";
import { useCalendar } from "./context/CalendarContext";
import monthNames from "../../constants/calendar.json";
import { useCalendarView } from "./context/CalendarViewContext";
import {CalendarModal} from "./CalendarModal";

export const CalendarHeader: React.FC = () => {
    const { view, setView } = useCalendarView();
    const { currentDate, setCurrentDate, goToNext, goToPrev, goToToday } = useCalendar();
    const [currentMonthName, setCurrentMonthName] = useState(monthNames.monthNames[currentDate.getMonth()]);
    const [inputYear, setInputYear] = useState(currentDate.getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
    const [selectedDay, setSelectedDay] = useState(currentDate.getDate().toString());
    const calendarModalRef = useRef<HTMLDialogElement>(null);

    const handleAddEvent = () => {
        if (calendarModalRef.current) {
            calendarModalRef.current.showModal();
        }
    };

    useEffect(() => {
        setCurrentMonthName(monthNames.monthNames[currentDate.getMonth()]);
        setInputYear(currentDate.getFullYear().toString());
        setSelectedMonth(currentDate.getMonth().toString());
        setSelectedDay(currentDate.getDate().toString());
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

    const handleDateChange = () => {
        const year = parseInt(inputYear);
        const month = parseInt(selectedMonth);
        const day = parseInt(selectedDay);
        const newDate = new Date(year, month, day);
        if (!isNaN(newDate.getTime())) {
            setCurrentDate(newDate);
        }
    };

    const handleYearKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleDateChange();
        }
    };

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    return (
        <div className="flex justify-between items-center p-4 min-h-headerHeight h-full">
            <h1 className="text-xl font-bold">{formatDate()}</h1>
            <button className="btn btn-sm" onClick={() => goToPrev(view)}>Previous</button>
            <button className="btn btn-sm" onClick={() => goToNext(view)}>Next</button>
            <button className="btn btn-sm" onClick={goToToday}>Today</button>
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    value={inputYear}
                    onChange={(e) => setInputYear(e.target.value)}
                    onKeyDown={handleYearKeyDown}
                    className="btn btn-sm"
                    placeholder="Year"
                />
                <select
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setSelectedDay("1"); // Reset day to 1 when month changes
                    }}
                    onBlur={handleDateChange}
                    className="btn btn-sm"
                >
                    {monthNames.monthNames.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    onBlur={handleDateChange}
                    className="btn btn-sm"
                >
                    {Array.from({ length: daysInMonth(parseInt(inputYear), parseInt(selectedMonth)) }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
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
                <button className="btn" onClick={handleAddEvent}>open modal</button>
                <CalendarModal ref={calendarModalRef} />
            </div>
        </div>
    );
};
