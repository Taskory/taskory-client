// CalendarHeader.tsx

import React, { useState, useEffect } from 'react';
import { useCalendar } from './context/CalendarContext';
import { useCalendarView } from './context/CalendarViewContext';
import monthNames from '../../constants/calendar.json';
import EventModal from './EventModal';

export const CalendarHeader: React.FC = React.memo(() => {
  const { view, setView } = useCalendarView();
  const { currentDate, setCurrentDate, goToNext, goToPrev, goToToday, refetchEvents } = useCalendar();
  const [currentMonthName, setCurrentMonthName] = useState(monthNames.monthNames[currentDate.getMonth()]);
  const [inputYear, setInputYear] = useState(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate().toString());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const handleAddEvent = () => {
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
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

    switch (view) {
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
        return `${year} ${startMonth} ${startOfWeek.getDate()} ~ ${endMonth} ${endOfWeek.getDate()}`;
      }
      case 'day':
      default:
        return `${year} ${month} ${day}`;
    }
  };

  const handleDateChange = (newYear: string, newMonth: string, newDay: string) => {
    const year = parseInt(newYear);
    const month = parseInt(newMonth);
    const day = parseInt(newDay);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      let newDate;
      switch (view) {
        case 'year':
          newDate = new Date(year, 0, 1); // Set to January 1st for the year view
          break;
        case 'month':
          newDate = new Date(year, month, 1); // Set to the 1st of the selected month
          break;
        case 'week':
        case 'day':
        default:
          newDate = new Date(year, month, day); // Use selected year, month, and day
          break;
      }
      setCurrentDate(newDate);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value;
    setInputYear(newYear);
    handleDateChange(newYear, selectedMonth, selectedDay); // Immediately update date
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    handleDateChange(inputYear, newMonth, selectedDay); // Immediately update date
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = e.target.value;
    setSelectedDay(newDay);
    handleDateChange(inputYear, selectedMonth, newDay); // Immediately update date
  };

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* Navigation Controls */}
        <div className="flex space-x-2 items-center">
          <button className="btn btn-sm" onClick={() => goToPrev(view)}>{'<'}</button>
          <button className="btn btn-sm" onClick={goToToday}>Today</button>
          <button className="btn btn-sm" onClick={() => goToNext(view)}>{'>'}</button>


          {/* View and Event Controls */}
          <div className="flex space-x-2 items-center">
            <select
                className="select select-sm"
                onChange={(e) => setView(e.target.value)}
                value={view}
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>



        {/* Date Display */}
        <h1 className="font-semibold">{formatDate()}</h1>

        {/* Date Input Controls */}
        <div className="flex space-x-1">
          {/* Year Input */}
          <input
              type="number"
              value={inputYear}
              onChange={handleYearChange} // Immediately update date on change
              className="w-20 text-center"
              placeholder="Year"
          />

          {/* Conditionally show month select if view is 'month', 'week', or 'day' */}
          {view !== 'year' && (
              <select
                  value={selectedMonth}
                  onChange={handleMonthChange} // Immediately update date on change
                  className="select select-sm"
              >
                {monthNames.monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                ))}
              </select>
          )}

          {/* Conditionally show day select if view is 'day' or 'week' */}
          {(view === 'day' || view === 'week') && (
              <select
                  value={selectedDay}
                  onChange={handleDayChange} // Immediately update date on change
                  className="select select-sm"
              >
                {Array.from(
                    {length: daysInMonth(parseInt(inputYear), parseInt(selectedMonth))},
                    (_, i) => i + 1,
                ).map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
              </select>
          )}
        </div>

        <button className="btn bg-purple-500 text-white hover:bg-purple-600" onClick={handleAddEvent}>
          Create Event
        </button>

        {/* EventModal integration */}
        <EventModal isOpen={isEventModalOpen} onClose={handleCloseEventModal} refetchEvents={refetchEvents}/>
      </div>
  );
});
