import React from 'react';
import { useCalendar } from './context/CalendarContext';
import { useCalendarView } from './context/CalendarViewContext';

export const YearCalendar: React.FC = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  const { setView } = useCalendarView();
  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  const daysInMonth = (month: number) => {
    return new Date(currentDate.getFullYear(), month, 0).getDate();
  };

  const handleMonthClick = (month: string) => {
    setView('month');
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(month), 1)); // Changed day to 1 instead of 0
  };

  const firstDayOfWeek = (month: number) => {
    return new Date(currentDate.getFullYear(), month, 1).getDay();
  };

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-2 p-2 h-full flex-grow">
      {months.map((month) => (
        <div
          key={month}
          className="p-1 border rounded-lg cursor-pointer"
          onClick={() => handleMonthClick(month)}
        >
          <div className="text-center content-center font-semibold h-[15%]">
            {month}
          </div>
          <div className="grid grid-cols-7 text-center h-[85%]">
            {Array(firstDayOfWeek(parseInt(month)))
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${month}-${index}`} /> // Ensure each empty div has a unique key
              ))}
            {/* Render the days of the month */}
            {Array.from({ length: daysInMonth(parseInt(month)) }, (_, day) => (
              <div key={`day-${month}-${day}`}>{day + 1}</div> // Add a unique key for each day
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
