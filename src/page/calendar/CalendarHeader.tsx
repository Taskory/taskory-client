// CalendarHeader.tsx

import React, { useState, useEffect } from 'react';
import { useCalendar } from './context/CalendarContext';
import { useCalendarView } from './context/CalendarViewContext';
import monthNames from '../../constants/calendar.json';
import { debounce } from 'lodash';
import EventModal from './EventModal'; // Import the EventModal

export const CalendarHeader: React.FC = React.memo(() => {
  const { view, setView } = useCalendarView();
  const { currentDate, setCurrentDate, goToNext, goToPrev, goToToday, refetchEvents } = useCalendar();
  const [currentMonthName, setCurrentMonthName] = useState(monthNames.monthNames[currentDate.getMonth()]);
  const [inputYear, setInputYear] = useState(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate().toString());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // State for opening modal

  const debouncedHandleYearChange = debounce((year: string) => {
    setInputYear(year);
    handleDateChange();
  }, 300);

  const handleAddEvent = () => {
    setIsEventModalOpen(true); // Open modal
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false); // Close modal
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
        return `${year} ${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
      }
      case 'day':
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
        <div className="flex space-x-2">
          <button className="btn btn-sm" onClick={() => goToPrev(view)}>Previous</button>
          <button className="btn btn-sm" onClick={() => goToNext(view)}>Next</button>
          <button className="btn btn-sm" onClick={goToToday}>Today</button>
        </div>

        <div className="flex items-center space-x-4">
          <input
              type="number"
              value={inputYear}
              onChange={(e) => debouncedHandleYearChange(e.target.value)}
              onKeyDown={handleYearKeyDown}
              className="btn btn-sm"
              placeholder="Year"
          />
          <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay('1');
              }}
              onBlur={handleDateChange}
              className="btn btn-sm"
          >
            {monthNames.monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              onBlur={handleDateChange}
              className="btn btn-sm"
          >
            {Array.from(
                { length: daysInMonth(parseInt(inputYear), parseInt(selectedMonth)) },
                (_, i) => i + 1,
            ).map((day) => (
                <option key={day} value={day}>{day}</option>
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
          <button className="btn btn-sm" onClick={handleAddEvent}>
            Create Event
          </button>
        </div>

        {/* EventModal integration */}
        <EventModal isOpen={isEventModalOpen} onClose={handleCloseEventModal} refetchEvents={refetchEvents}/>
      </div>
  );
});
