import {CalendarProvider} from "./context/CalendarContext";
import React from "react";
import { CalendarViewProvider } from "./context/CalendarViewContext";
import {ScrollBarContextProvider} from "./context/ScrollBarContext";

interface CalendarWrapperProps {
    children: React.ReactNode;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({children}) => {
    return (
        <ScrollBarContextProvider>
            <CalendarViewProvider>
                <CalendarProvider>
                    {children}
                </CalendarProvider>
            </CalendarViewProvider>
        </ScrollBarContextProvider>
    );
};