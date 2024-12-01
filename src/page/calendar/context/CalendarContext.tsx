import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode, useReducer } from 'react';
import { SplitEventsInterface } from "./CalendarContextInterface";
import { getProcessedEvents } from "./CalendarContextUtils";
import { EventSummary } from "../../../api/event/EventsTypes";
import {TimeUtil} from "../../../util/TimeUtil";
import {useEventContext} from "../../../context/data/EventContext";

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    goToNext: (view: string) => void;
    goToPrev: (view: string) => void;
    goToToday: () => void;
    monthlyEvents: EventSummary[];
    processedEvents: SplitEventsInterface;
    filterEventsByMonth: () => void;
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

// Modify CalendarProvider to include refetchEvents
export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {originEvents, initSelectedDateEventInfo} = useEventContext();
    const [state, dispatch] = useReducer(calendarReducer, {
        currentDate: getInitialDate(),
        sumOfMonthAndYear: getInitialDate().getFullYear() + getInitialDate().getMonth()
    });
    const [monthlyEvents, setMonthlyEvents] = useState<EventSummary[]>([]);
    const [processedEvents, setProcessedEvents] = useState<SplitEventsInterface>({ eventsUnder24: [], eventsOver24: [] });

    const filterEventsByMonth = useCallback(() => {
        const utcString: string = TimeUtil.dateToString(state.currentDate);
        const referenceDate = new Date(utcString);
        const referenceYear = referenceDate.getFullYear();
        const referenceMonth = referenceDate.getMonth();

        const monthlyEvents = originEvents.filter(event => {
            const eventStartDate = new Date(event.startDateTime);
            const eventEndDate = new Date(event.dueDateTime);

            return (
                (eventStartDate.getFullYear() === referenceYear && eventStartDate.getMonth() === referenceMonth) ||
                (eventEndDate.getFullYear() === referenceYear && eventEndDate.getMonth() === referenceMonth)
            );
        });

        setMonthlyEvents(monthlyEvents);
    }, [state.currentDate, originEvents]);

    useEffect(() => {
        // Save the current date and timestamp in local storage
        localStorage.setItem('currentDate', state.currentDate.toISOString());
        localStorage.setItem('currentDateTimestamp', new Date().toISOString());

        // Fetch events whenever sumOfMonthAndYear or currentDate changes
        filterEventsByMonth();
    }, [state.sumOfMonthAndYear, filterEventsByMonth, state.currentDate]);

    useEffect(() => {
        // Split events based on the current month
        setProcessedEvents(getProcessedEvents(monthlyEvents, new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), 1)));
    }, [monthlyEvents, state.currentDate]);

    const goToNext = useCallback((view: string) => {
        const newDate = new Date(state.currentDate);
        initSelectedDateEventInfo();
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
    }, [initSelectedDateEventInfo, state.currentDate]);

    const goToPrev = useCallback((view: string) => {
        const newDate = new Date(state.currentDate);
        initSelectedDateEventInfo();
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
    }, [initSelectedDateEventInfo, state.currentDate]);

    const goToToday = useCallback(() => {
        dispatch({ type: 'SET_DATE', payload: new Date() });
    }, []);

    const contextValue: CalendarContextType = useMemo(() => ({
        currentDate: state.currentDate,
        setCurrentDate: (date: Date) => dispatch({ type: 'SET_DATE', payload: date }),
        goToNext,
        goToPrev,
        goToToday,
        monthlyEvents,
        processedEvents,
        filterEventsByMonth,
    }), [state.currentDate, goToNext, goToPrev, goToToday, monthlyEvents, processedEvents, filterEventsByMonth]);

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
