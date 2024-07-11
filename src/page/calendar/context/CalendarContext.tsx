import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    goToNext: (view: string) => void;
    goToPrev: (view: string) => void;
    goToToday: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const getInitialDate = () => {
    const savedDate = localStorage.getItem('currentDate');
    const savedTimestamp = localStorage.getItem('currentDateTimestamp');
    if (savedDate && savedTimestamp) {
        const savedDateObj = new Date(savedDate);
        const savedTimestampObj = new Date(savedTimestamp);
        const now = new Date();
        const diff = now.getTime() - savedTimestampObj.getTime();
        if (diff <= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            return savedDateObj;
        }
    }
    return new Date();
};

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState<Date>(getInitialDate);

    useEffect(() => {
        localStorage.setItem('currentDate', currentDate.toISOString());
        localStorage.setItem('currentDateTimestamp', new Date().toISOString());
    }, [currentDate]);

    const goToNext = (view: string) => {
        const newDate = new Date(currentDate);
        switch(view) {
            case 'year':
                newDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            case 'month':
                newDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'week':
                newDate.setDate(currentDate.getDate() + 7);
                break;
            case 'day':
                newDate.setDate(currentDate.getDate() + 1);
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    };

    const goToPrev = (view: string) => {
        const newDate = new Date(currentDate);
        switch(view) {
            case 'year':
                newDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            case 'month':
                newDate.setMonth(currentDate.getMonth() - 1);
                break;
            case 'week':
                newDate.setDate(currentDate.getDate() - 7);
                break;
            case 'day':
                newDate.setDate(currentDate.getDate() - 1);
                break;
            default:
                break;
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const contextValue = useMemo(() => ({
        currentDate,
        setCurrentDate,
        goToNext,
        goToPrev,
        goToToday
    }), [currentDate]);

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
