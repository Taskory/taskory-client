import {useCalendarView} from "./context/CalendarViewContext";
import {YearlyPage} from "./year/YearlyPage";
import {MonthlyPage} from "./month/MonthlyPage";
import {WeeklyPage} from "./week/WeeklyPage";
import {DailyPage} from "./day/DailyPage";
import React from "react";

export const CalendarContents = () => {
    const {view} = useCalendarView();

    const renderCalendarView = () => {
        switch(view) {
            case 'year':
                return <YearlyPage />;
            case 'month':
                return <MonthlyPage />;
            case 'week':
                return <WeeklyPage />;
            case 'day':
                return <DailyPage />;
            default:
                return <MonthlyPage />;
        }
    };
    return (
        <>{renderCalendarView()}</>
    );
};