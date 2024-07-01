import {CommonLayout} from "../../layout/CommonLayout";
import {CalendarHeader} from "./component/CalendarHeader";
import React from "react";
import {MonthCalendar} from "./component/month/MonthCalendar";
import {DayCalendar} from "./component/day/DayCalendar";
import {YearCalendar} from "./component/year/YearCalendar";
import {WeekCalendar} from "./component/week/WeekCalendar";
import {CalendarProvider} from "./context/CalendarContext";
import {useCalendarView} from "../../context/CalendarViewContext";

export const Calendar = () => {
    const {view, setView} = useCalendarView();

    const renderMonthView = () => {
        setView('month');
    }

    const renderCalendarView = () => {
        switch(view) {
            case 'year':
                return <YearCalendar renderMonthView={renderMonthView} />;
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
                <CalendarHeader setView={setView}/>
                {renderCalendarView()}
            </CalendarProvider>
        </CommonLayout>
    );
};
