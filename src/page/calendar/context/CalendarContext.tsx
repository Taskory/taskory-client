import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {EventInterface} from "../../../api/interface/EventInterface";

interface CalendarContextType {
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    goToNext: (view: string) => void;
    goToPrev: (view: string) => void;
    goToToday: () => void;
    events: EventInterface[];
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
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [sumOfMonthAndYear, setSumOfMonthAndYear] = useState<number>(currentDate.getFullYear() + currentDate.getMonth());

    useEffect(() => {
        localStorage.setItem('currentDate', currentDate.toISOString());
        localStorage.setItem('currentDateTimestamp', new Date().toISOString());

        const newSum = currentDate.getFullYear() + currentDate.getFullYear();
        if (newSum !== sumOfMonthAndYear) {
            // requestMonthlyEvents(currentDate)
            //     .then((result) => {
            //         if (result) {
            //             setEvents(result);
            //         }
            //     });
         
            // Dummy data
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()));
            const initData: EventInterface[] = [
                {
                    id: 1,
                    title: "Company Meeting",
                    tag: {id: 1, title: "Work", color: "yellow"},
                    hashtags: [{id: 1, title: "#meeting"}],
                    description: "Weekly team meeting to discuss contract updates.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 11, 0).toISOString(),
                    location: "Conference Room B"
                },
                {
                    id: 0,
                    title: "Client Meeting",
                    tag: {id: 1, title: "Work", color: "purple"},
                    hashtags: [{id: 1, title: "#meeting"}],
                    description: "Weekly team meeting to discuss contract updates.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 12, 0).toISOString(),
                    location: "Conference Room B"
                },
                {
                    id: 2,
                    title: "A Team Meeting",
                    tag: {id: 1, title: "Work", color: "blue"},
                    hashtags: [{id: 1, title: "#meeting"}],
                    description: "Weekly team meeting to discuss project updates.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 30).toISOString(),
                    location: "Conference Room A"
                },
                {
                    id: 2,
                    title: "B Team Meeting2",
                    tag: {id: 1, title: "Work", color: "blue"},
                    hashtags: [{id: 1, title: "#meeting"}],
                    description: "Weekly team meeting to discuss project updates.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 12, 30).toISOString(),
                    location: "Conference Room A"
                },
                {
                    id: 3,
                    title: "Code Review",
                    tag: {id: 2, title: "Work", color: "green"},
                    hashtags: [{id: 2, title: "#code"}, {id: 3, title: "#review"}],
                    description: "Review the latest code commits.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 14, 0).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 15, 0).toISOString(),
                    location: "Zoom"
                },
                {
                    id: 4,
                    title: "Lunch with Client",
                    tag: {id: 3, title: "Personal", color: "red"},
                    hashtags: [{id: 4, title: "#lunch"}, {id: 5, title: "#client"}],
                    description: "Discuss project requirements with the client.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 12, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 13, 30).toISOString(),
                    location: "Restaurant B"
                },
                {
                    id: 4,
                    title: "Lunch with Client",
                    tag: {id: 3, title: "Personal", color: "red"},
                    hashtags: [{id: 4, title: "#lunch"}, {id: 5, title: "#client"}],
                    description: "Discuss project requirements with the client.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 11, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 16, 30).toISOString(),
                    location: "Restaurant B"
                },
                {
                    id: 4,
                    title: "Lunch with Client",
                    tag: {id: 3, title: "Personal", color: "red"},
                    hashtags: [{id: 4, title: "#lunch"}, {id: 5, title: "#client"}],
                    description: "Discuss project requirements with the client.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 16, 30).toISOString(),
                    location: "Restaurant B"
                },
                {
                    id: 4,
                    title: "Lunch with Client",
                    tag: {id: 3, title: "Personal", color: "red"},
                    hashtags: [{id: 4, title: "#lunch"}, {id: 5, title: "#client"}],
                    description: "Discuss project requirements with the client.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 30).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 16, 30).toISOString(),
                    location: "Restaurant B"
                },
                {
                    id: 5,
                    title: "Yoga Class",
                    tag: {id: 4, title: "Health", color: "purple"},
                    hashtags: [{id: 6, title: "#yoga"}, {id: 7, title: "#fitness"}],
                    description: "Attend the weekly yoga class for relaxation.",
                    startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 18, 0).toISOString(),
                    dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 19, 0).toISOString(),
                    location: "Gym"
                },
                {
                    id: 6,
                    title: "Project Deadline",
                    tag: {id: 5, title: "Work", color: "orange"},
                    hashtags: [{id: 8, title: "#deadline"}, {id: 9, title: "#project"}],
                    description: "Submit the final project deliverables.",
                    startDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 17, 0).toISOString(),
                    dueDateTime: new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 23, 59).toISOString(),
                    location: "Office"
                }
            ];
            setEvents(initData);

            setSumOfMonthAndYear(currentDate.getFullYear() + currentDate.getMonth());
        }
    }, [currentDate, sumOfMonthAndYear]);

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
        goToToday,
        events
    }), [currentDate, events]);

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
