import {CommonLayout} from "../../layout/CommonLayout";
import {CalendarHeader} from "./component/CalendarHeader";
import React from "react";
import {MonthCalendar} from "./component/MonthCalendar";
import {DayCalendar} from "./component/DayCalendar";
import {YearCalendar} from "./component/YearCalendar";
import {WeekCalendar} from "./component/WeekCalendar";
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
                <CalendarHeader />
                {renderCalendarView()}
            </CalendarProvider>
        </CommonLayout>
    );
};
