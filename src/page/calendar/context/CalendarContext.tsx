import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode, useReducer } from 'react';
import { SplitEventsInterface } from "../interface/CalendarContextInterface";
import { getSplitEvents } from "../util/CalendarContextUtils";
import { getMonthlyEvents } from "../../../api/event/EventApi";
import { EventSummary } from "../../../api/event/EventsTypes";

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    goToNext: (view: string) => void;
    goToPrev: (view: string) => void;
    goToToday: () => void;
    originEvents: EventSummary[];
    splitEvents: SplitEventsInterface;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Get the initial date either from local storage (if less than 24 hours old) or current date
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

// Reducer for managing calendar's current date and the sum of month + year
const calendarReducer = (state: { currentDate: Date; sumOfMonthAndYear: number; }, action: { type: string; payload?: any }) => {
    switch (action.type) {
        case 'SET_DATE':
            return {
                ...state,
                currentDate: action.payload,
                sumOfMonthAndYear: action.payload.getFullYear() + action.payload.getMonth()
            };
        default:
            return state;
    }
};

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(calendarReducer, {
        currentDate: getInitialDate(),
        sumOfMonthAndYear: getInitialDate().getFullYear() + getInitialDate().getMonth()
    });
    const [originEvents, setOriginEvents] = useState<EventSummary[]>([]);
    const [splitEvents, setSplitEvents] = useState<SplitEventsInterface>({ eventsUnder24: [], eventsOver24: [] });

    useEffect(() => {
        // Save the current date and timestamp in local storage
        localStorage.setItem('currentDate', state.currentDate.toISOString());
        localStorage.setItem('currentDateTimestamp', new Date().toISOString());

        // Fetch events for the current month whenever the sumOfMonthAndYear or date changes
        const fetchEvents = async () => {
            try {
                const response = await getMonthlyEvents(`${state.currentDate.getFullYear()}-${state.currentDate.getMonth()}-${state.currentDate.getDate()}`);
                setOriginEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [state.sumOfMonthAndYear, state.currentDate]);

    useEffect(() => {
        // Split events based on the current month
        setSplitEvents(getSplitEvents(originEvents, new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), 1)));
    }, [originEvents, state.currentDate]);

    // Move forward based on the current view (year, month, week, day)
    const goToNext = useCallback((view: string) => {
        const newDate = new Date(state.currentDate);
        switch (view) {
            case 'year':
                newDate.setFullYear(state.currentDate.getFullYear() + 1);
                break;
            case 'month':
                newDate.setMonth(state.currentDate.getMonth() + 1);
                break;
            case 'week':
                newDate.setDate(state.currentDate.getDate() + 7);
                break;
            case 'day':
                newDate.setDate(state.currentDate.getDate() + 1);
                break;
            default:
                break;
        }
        dispatch({ type: 'SET_DATE', payload: newDate });
    }, [state.currentDate]);

    // Move backward based on the current view (year, month, week, day)
    const goToPrev = useCallback((view: string) => {
        const newDate = new Date(state.currentDate);
        switch (view) {
            case 'year':
                newDate.setFullYear(state.currentDate.getFullYear() - 1);
                break;
            case 'month':
                newDate.setMonth(state.currentDate.getMonth() - 1);
                break;
            case 'week':
                newDate.setDate(state.currentDate.getDate() - 7);
                break;
            case 'day':
                newDate.setDate(state.currentDate.getDate() - 1);
                break;
            default:
                break;
        }
        dispatch({ type: 'SET_DATE', payload: newDate });
    }, [state.currentDate]);

    // Set current date to today
    const goToToday = useCallback(() => {
        dispatch({ type: 'SET_DATE', payload: new Date() });
    }, []);

    // Memoize context value to avoid unnecessary re-renders
    const contextValue = useMemo(() => ({
        currentDate: state.currentDate,
        setCurrentDate: (date: Date) => dispatch({ type: 'SET_DATE', payload: date }),
        goToNext,
        goToPrev,
        goToToday,
        originEvents,
        splitEvents
    }), [state.currentDate, goToNext, goToPrev, goToToday, originEvents, splitEvents]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};

// Hook to access the calendar context
export const useCalendar = (): CalendarContextType => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
