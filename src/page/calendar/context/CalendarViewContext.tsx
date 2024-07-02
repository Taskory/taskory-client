import React, {createContext, useContext, useState, ReactNode, useMemo, useEffect} from 'react';

interface CalendarViewContextType {
    view: string;
    setView: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarViewContext = createContext<CalendarViewContextType | undefined>(undefined);

export const CalendarViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const viewKey = "calendar-view";
    const storedView = localStorage.getItem(viewKey) || 'month';
    const [view, setView] = useState(storedView);

    const contextValue = useMemo(() => ({
        view,
        setView,
    }), [view]);

    useEffect(() => {
        localStorage.setItem(viewKey, view);
    }, [view]);

    return (
        <CalendarViewContext.Provider value={contextValue}>
            {children}
        </CalendarViewContext.Provider>
    );
};

export const useCalendarView = (): CalendarViewContextType => {
    const context = useContext(CalendarViewContext);
    if (context === undefined) {
        throw new Error('useCalendarView must be used within a CalendarViewProvider');
    }
    return context;
};
