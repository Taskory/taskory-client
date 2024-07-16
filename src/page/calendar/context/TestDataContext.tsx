import React, {createContext, useContext, useState, ReactNode, useMemo} from 'react';
import {useCalendar} from "./CalendarContext";
import {EventInterface} from "../../../api/interface/EventInterface";

interface TestDataContextType {
    dummyEvents: EventInterface[];
}

const TestDataContext = createContext<TestDataContextType | undefined>(undefined);

export const TestDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {currentDate} = useCalendar();
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
            title: "Company Meeting",
            tag: {id: 1, title: "Work", color: "purple"},
            hashtags: [{id: 1, title: "#meeting"}],
            description: "Weekly team meeting to discuss contract updates.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 12, 0).toISOString(),
            location: "Conference Room B"
        },
        {
            id: 1,
            title: "Company Meeting",
            tag: {id: 1, title: "Work", color: "red"},
            hashtags: [{id: 1, title: "#meeting"}],
            description: "Weekly team meeting to discuss contract updates.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 0).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 30).toISOString(),
            location: "Conference Room B"
        },
        {
            id: 2,
            title: "Team Meeting",
            tag: {id: 1, title: "Work", color: "blue"},
            hashtags: [{id: 1, title: "#meeting"}],
            description: "Weekly team meeting to discuss project updates.",
            startDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 10, 30).toISOString(),
            dueDateTime: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 11, 30).toISOString(),
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

    const [dummyEvents] = useState(initData);

    const contextValue = useMemo(() => ({
        dummyEvents
    }), [dummyEvents]);

    return (
        <TestDataContext.Provider value={contextValue}>
            {children}
        </TestDataContext.Provider>
    );
};

export const useTestData = (): TestDataContextType => {
    const context = useContext(TestDataContext);
    if (context === undefined) {
        throw new Error('useCalendarView must be used within a CalendarViewProvider');
    }
    return context;
};
