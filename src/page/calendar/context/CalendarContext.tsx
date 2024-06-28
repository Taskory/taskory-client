// CalendarContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const contextValue = useMemo(() => ({
        currentDate,
        setCurrentDate
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
