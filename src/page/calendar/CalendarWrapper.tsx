import {CalendarProvider} from "./context/CalendarContext";
import {EventModalProvider} from "./context/EventModalContext";
import React from "react";

interface CalendarWrapperProps {
    children: React.ReactNode;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({children}) => {
    return (
        <CalendarProvider>
            <EventModalProvider>
                {children}
            </EventModalProvider>
        </CalendarProvider>
    );
};