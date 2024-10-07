import {CommonLayout} from "../../layout/CommonLayout";
import React from "react";
import {CalendarProvider} from "./context/CalendarContext";
import { CalendarHeader } from "./CalendarHeader";
import { WeeklyPage } from "./week/WeeklyPage";
import { YearlyPage } from "./year/YearlyPage";
import { MonthlyPage } from "./month/MonthlyPage";
import { DailyPage } from "./day/DailyPage";
import { useCalendarView } from "./context/CalendarViewContext";
import {EventModalProvider} from "./context/EventModalContext";

export const CalendarPage = () => {
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
        <CommonLayout>
            <CalendarProvider>
                <EventModalProvider>
                    <div className="flex flex-col h-full">
                        {/* CalendarHeader should be sticky */}
                        <CalendarHeader/>
                        {renderCalendarView()}
                    </div>
                </EventModalProvider>
            </CalendarProvider>
        </CommonLayout>
    );
};