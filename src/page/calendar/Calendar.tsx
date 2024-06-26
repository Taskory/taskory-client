import {CommonLayout} from "../../layout/CommonLayout";
import {CalendarHeader} from "./component/CalendarHeader";
import React from "react";
import {MonthCalendar} from "./component/month/MonthCalendar";

export const Calendar = () => {

    return (
        <CommonLayout>
                <CalendarHeader />
                <MonthCalendar />
        </CommonLayout>
    );
};