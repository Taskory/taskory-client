import {CommonLayout} from "../../layout/CommonLayout";
import {CalendarHeader} from "./CalendarHeader";
import React from "react";
import {MonthCalendar} from "./MonthCalendar";
import {DayCalendar} from "./DayCalendar";
import {YearCalendar} from "./YearCalendar";
import {WeekCalendar} from "./WeekCalendar";
import {CalendarProvider} from "./context/CalendarContext";
import {useCalendarView} from "./context/CalendarViewContext";

export const Calendar = () => {
    const {view} = useCalendarView();

    const renderCalendarView = () => {
        switch(view) {
            case 'year':
                return <YearCalendar />;
            case 'month':
                return <MonthCalendar />;
            case 'week':
                return <WeekCalendar />;
            case 'day':
                return <DayCalendar />;
            default:
                return <MonthCalendar />;
        }
    };

    return (
        <CommonLayout>
            <CalendarProvider>
                <div className="w-full h-full">
                    <div className="h-[10%]">
                        <CalendarHeader/>
                    </div>
                    <div className="h-[90%]">
                        {renderCalendarView()}
                    </div>
                </div>
            </CalendarProvider>
        </CommonLayout>
    );
};
