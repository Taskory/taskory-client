import {CalendarProvider} from "./context/CalendarContext";
import {EventModalProvider} from "./context/EventModalContext";
import {CommonLayout} from "../../layout/CommonLayout";
import React from "react";

interface CalendarWrapperProps {
    children: React.ReactNode;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({children}) => {
    return (
        <CommonLayout>
            <CalendarProvider>
                <EventModalProvider>
                    {children}
                </EventModalProvider>
            </CalendarProvider>
        </CommonLayout>
    );
};