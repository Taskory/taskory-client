import {CommonLayout} from "../../layout/CommonLayout";
import React from "react";
import {CalendarProvider} from "./context/CalendarContext";
import { CalendarHeader } from "./CalendarHeader";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { YearlyCalendar } from "./YearlyCalendar";
import { MonthlyCalendar } from "./MonthlyCalendar";
import { DailyCalendar } from "./DailyCalendar";
import { useCalendarView } from "./context/CalendarViewContext";
import {EventModalProvider} from "./context/EventModalContext";

export const CalendarPage = () => {
    const {view} = useCalendarView();

    const renderCalendarView = () => {
        switch(view) {
            case 'year':
                return <YearlyCalendar />;
            case 'month':
                return <MonthlyCalendar />;
            case 'week':
                return <WeeklyCalendar />;
            case 'day':
                return <DailyCalendar />;
            default:
                return <MonthlyCalendar />;
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