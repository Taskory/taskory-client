import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    goToNext: (view: string) => void;
    goToPrev: (view: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

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

    const contextValue = useMemo(() => ({
        currentDate,
        setCurrentDate,
        goToNext,
        goToPrev
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
