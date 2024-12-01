import {CalendarProvider} from "./context/CalendarContext";
import React from "react";

interface CalendarWrapperProps {
    children: React.ReactNode;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({children}) => {
    return (
        <CalendarProvider>
            {children}
        </CalendarProvider>
    );
};