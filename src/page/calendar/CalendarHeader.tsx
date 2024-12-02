// CalendarHeader.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useCalendar } from './context/CalendarContext';
import { useCalendarView } from './context/CalendarViewContext';
import monthNames from '../../constants/calendar.json';
import { useEventModal } from '../../context/modal/EventModalContext';
import {MonthlyHeader} from "./month/MonthlyHeader";
import {WeeklyHeader} from "./week/WeeklyHeader";
import {DailyHeader} from "./day/DailyHedaer";

export const CalendarHeader: React.FC = React.memo(() => {
  const { view, setView } = useCalendarView();
  const { currentDate, setCurrentDate, goToNext, goToPrev, goToToday } = useCalendar();
  const { openEventModal } = useEventModal();

  const [inputYear, setInputYear] = useState(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate().toString());

  // Update input states when currentDate changes
  useEffect(() => {
    setInputYear(currentDate.getFullYear().toString());
    setSelectedMonth(currentDate.getMonth().toString());
    setSelectedDay(currentDate.getDate().toString());
  }, [currentDate]);

  // Helper to handle date change
  const handleDateChange = useCallback(
      (year: string, month: string, day: string) => {
        const parsedYear = parseInt(year);
        const parsedMonth = parseInt(month);
        const parsedDay = parseInt(day);

        if (!isNaN(parsedYear) && !isNaN(parsedMonth) && !isNaN(parsedDay)) {
          const newDate =
              view === 'year'
                  ? new Date(parsedYear, 0, 1)
                  : view === 'month'
                      ? new Date(parsedYear, parsedMonth, 1)
                      : new Date(parsedYear, parsedMonth, parsedDay);
          setCurrentDate(newDate);
        }
      },
      [view, setCurrentDate]
  );

  // Event Handlers
  const handleYearChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = e.target.value;
        setInputYear(newYear);
        handleDateChange(newYear, selectedMonth, selectedDay);
      },
      [handleDateChange, selectedMonth, selectedDay]
  );

  const handleMonthChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);
        handleDateChange(inputYear, newMonth, selectedDay);
      },
      [handleDateChange, inputYear, selectedDay]
  );

  const handleDayChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDay = e.target.value;
        setSelectedDay(newDay);
        handleDateChange(inputYear, selectedMonth, newDay);
      },
      [handleDateChange, inputYear, selectedMonth]
  );

  // Get the number of days in the selected month and year
  const getDaysInMonth = useCallback(
      (year: number, month: number) => new Date(year, month + 1, 0).getDate(),
      []
  );



    function renderCalendarHeader() {
        switch(view) {
            case 'year':
                return <></>;
            case 'month':
                return <MonthlyHeader />;
            case 'week':
                return <WeeklyHeader />;
            case 'day':
                return <DailyHeader />;
        }
    }

    return (
        <>
            <div className="w-full flex justify-between items-center border-r p-4 sticky top-0 z-20 bg-white border-b">
                {/* Date Input Controls */}
                <div className="flex space-x-1">
                    {/* View Selector */}
                    <div className="flex space-x-2 items-center">
                        <select className="select select-sm" onChange={(e) => setView(e.target.value)} value={view}>
                            <option value="year">Year</option>
                            <option value="month">Month</option>
                            <option value="week">Week</option>
                            <option value="day">Day</option>
                        </select>
                    </div>

                    {/* Year Input */}
                    <input
                        type="number"
                        value={inputYear}
                        onChange={handleYearChange}
                        className="w-20 text-center font-semibold text-lg"
                        placeholder="Year"
                    />

                    {/* Conditionally render Month and Day Inputs */}
                    {view !== 'year' && (
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="select select-sm font-semibold text-lg"
                        >
                            {monthNames.monthNames.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    )}

                    {(view === 'day' || view === 'week') && (
                        <select
                            value={selectedDay}
                            onChange={handleDayChange}
                            className="select select-sm font-semibold text-lg"
                        >
                            {Array.from(
                                {length: getDaysInMonth(parseInt(inputYear), parseInt(selectedMonth))},
                                (_, i) => i + 1
                            ).map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Navigation Controls */}
                <div className="flex space-x-2 items-center">
                    <button className="btn btn-sm" onClick={() => goToPrev(view)}>
                        {'<'}
                    </button>
                    <button className="btn btn-sm" onClick={goToToday}>
                        Today
                    </button>
                    <button className="btn btn-sm" onClick={() => goToNext(view)}>
                        {'>'}
                    </button>

                    <button className="btn btn-sm bg-blue-500 text-white" onClick={() => openEventModal()}>
                        + Event
                    </button>
                </div>
            </div>
            {renderCalendarHeader()}
        </>
    );
});
