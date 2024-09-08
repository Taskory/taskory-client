import React, { useEffect, useRef, useState } from 'react';
import { useCalendar } from './context/CalendarContext';
import monthNames from '../../constants/calendar.json';
import { useCalendarView } from './context/CalendarViewContext';
import { debounce } from 'lodash'; // lodash for debouncing input

export const CalendarHeader: React.FC = React.memo(() => {
  const { view, setView } = useCalendarView(); // Handles calendar view context (year, month, week, day)
  const { currentDate, setCurrentDate, goToNext, goToPrev, goToToday } =
      useCalendar(); // Calendar logic and date management
  const [currentMonthName, setCurrentMonthName] = useState(
      monthNames.monthNames[currentDate.getMonth()], // Initializing month name based on the current date
  );
  const [inputYear, setInputYear] = useState(currentDate.getFullYear().toString()); // Initializing year based on current date
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString()); // Initializing month
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate().toString()); // Initializing day
  const calendarModalRef = useRef<HTMLDialogElement>(null); // Reference to modal for event creation

  // Debounced handler for year input changes to optimize frequent updates
  const debouncedHandleYearChange = debounce((year: string) => {
    setInputYear(year);
    handleDateChange(); // Trigger date change after debounce delay
  }, 300);

  // Opens modal for event creation
  const handleAddEvent = () => {
    if (calendarModalRef.current) {
      calendarModalRef.current.showModal();
    }
  };

  // Update local states when currentDate changes
  useEffect(() => {
    setCurrentMonthName(monthNames.monthNames[currentDate.getMonth()]);
    setInputYear(currentDate.getFullYear().toString());
    setSelectedMonth(currentDate.getMonth().toString());
    setSelectedDay(currentDate.getDate().toString());
  }, [currentDate]);

  // Formats the date based on the current view (year, month, week, day)
  const formatDate = () => {
    const year = currentDate.getFullYear();
    const month = currentMonthName;
    const day = currentDate.getDate();

    switch (view) {
      case 'year':
        return `${year}`; // Year view displays only the year
      case 'month':
        return `${year} ${month}`; // Month view displays year and month
      case 'week': {
        // Week view shows a range of days from the start to the end of the week
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
        return `${year} ${month} ${day}`; // Default to day view
    }
  };

  // Handles the logic of updating the date based on user input (year, month, day)
  const handleDateChange = () => {
    const year = parseInt(inputYear);
    const month = parseInt(selectedMonth);
    const day = parseInt(selectedDay);
    const newDate = new Date(year, month, day);
    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate); // Update current date if it's valid
    }
  };

  // Detects Enter key press for confirming the year change
  const handleYearKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDateChange();
    }
  };

  // Returns the number of days in a given month of a year
  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
      <div className="flex justify-between items-center p-4 min-h-headerHeight h-full">
        <h1 className="text-xl font-bold">{formatDate()}</h1> {/* Displays formatted date based on view */}
        <div className="flex space-x-2">
          <button className="btn btn-sm" onClick={() => goToPrev(view)}>
            Previous {/* Navigate to previous date based on the view */}
          </button>
          <button className="btn btn-sm" onClick={() => goToNext(view)}>
            Next {/* Navigate to next date based on the view */}
          </button>
          <button className="btn btn-sm" onClick={goToToday}>
            Today {/* Reset to today's date */}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
              type="number"
              value={inputYear}
              onChange={(e) => debouncedHandleYearChange(e.target.value)} // Handle year input changes
              onKeyDown={handleYearKeyDown}
              className="btn btn-sm"
              placeholder="Year"
          />
          <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay('1'); // Reset day to 1 when month changes
              }}
              onBlur={handleDateChange} // Apply the date change when the month is selected
              className="btn btn-sm"
          >
            {monthNames.monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month} {/* Month selection */}
                </option>
            ))}
          </select>
          <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              onBlur={handleDateChange} // Apply the date change when the day is selected
              className="btn btn-sm"
          >
            {Array.from(
                {
                  length: daysInMonth(parseInt(inputYear), parseInt(selectedMonth)),
                },
                (_, i) => i + 1,
            ).map((day) => (
                <option key={day} value={day}>
                  {day} {/* Day selection */}
                </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <select
              className="btn btn-sm"
              onChange={(e) => setView(e.target.value)} // Change calendar view (year, month, week, day)
              value={view}
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button className="btn btn-sm" onClick={handleAddEvent}>
            Create Event {/* Button to trigger the modal for creating a new event */}
          </button>
        </div>
      </div>
  );
});
