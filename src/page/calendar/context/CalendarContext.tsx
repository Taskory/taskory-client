// CalendarContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface Event {
    date: string;
    name: string;
    time: string;
}

interface CalendarContextType {
    currentDate: Date;
    currentMonthName: string;
    daysOfWeek: string[];
    firstDayOfWeek: number;
    lastDayOfMonth: Date;
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = useMemo(() => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ], []);

    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

    const [currentMonthName, setCurrentMonthName] = useState(monthNames[currentDate.getMonth()]);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay());
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));

    useEffect(() => {
        setCurrentMonthName(monthNames[currentDate.getMonth()]);
        const firstDayOfMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        setFirstDayOfWeek(firstDayOfMonth.getDay());
        setLastDayOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    }, [currentDate, monthNames]);

    const initialEvents: Event[] = [
        { date: `2024-06-01`, name: 'Event Name', time: '08:00' },
        { date: `2024-06-01`, name: 'Event Name', time: '08:00' },
        { date: `2024-06-01`, name: 'Event Name', time: '08:00' },
        { date: `2024-06-01`, name: 'Event Name', time: '08:00' },
        { date: `2024-06-02`, name: 'Event Name', time: '08:00' },
        { date: `2024-06-${currentDate.getDate()}`, name: 'Today Event', time: '10:00' },
    ];

    const [events, setEvents] = useState<Event[]>(initialEvents);

    const contextValue = useMemo(() => ({
        currentDate,
        currentMonthName,
        daysOfWeek,
        firstDayOfWeek,
        lastDayOfMonth,
        events,
        setEvents,
        setCurrentDate
    }), [currentDate, currentMonthName, daysOfWeek, firstDayOfWeek, lastDayOfMonth, events]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = (): CalendarContextType => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
