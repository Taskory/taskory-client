import {CommonLayout} from "../../layout/CommonLayout";
import {CalendarHeader} from "./component/CalendarHeader";
import React from "react";
import {Month} from "./component/month/Month";

export const Calendar = () => {

    return (
        <CommonLayout>
                <CalendarHeader />
                <Month />
        </CommonLayout>
    );
};