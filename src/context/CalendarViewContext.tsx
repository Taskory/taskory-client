import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CalendarViewContextType {
    view: string;
    setView: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarViewContext = createContext<CalendarViewContextType | undefined>(undefined);

export const CalendarViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [view, setView] = useState("month");

    const contextValue = useMemo(() => ({
        view,
        setView,
    }), [view]);

    return (
        <CalendarViewContext.Provider value={contextValue}>
            {children}
        </CalendarViewContext.Provider>
    );
};

export const useCalendarView = (): CalendarViewContextType => {
    const context = useContext(CalendarViewContext);
    if (context === undefined) {
        throw new Error('useCalendarView must be used within a CalendarProvider');
    }
    return context;
};
