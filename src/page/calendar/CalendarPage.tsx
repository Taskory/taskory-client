import React from "react";
import { CalendarHeader } from "./CalendarHeader";
import {CalendarWrapper} from "./CalendarWrapper";
import { CalendarBody } from "./CalendarBody";

export const CalendarPage = () => {

    return (
        <CalendarWrapper>
            <div className="flex flex-col h-full">
                <CalendarHeader/>
                <CalendarBody />
            </div>
        </CalendarWrapper>
    );
};