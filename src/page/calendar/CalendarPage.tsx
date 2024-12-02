import React from "react";
import { CalendarTopBar } from "./CalendarTopBar";
import {CalendarWrapper} from "./CalendarWrapper";
import { CalendarBody } from "./CalendarBody";

export const CalendarPage = () => {

    return (
        <CalendarWrapper>
            <div className="flex flex-col h-full">
                <CalendarTopBar/>
                <CalendarBody />

            </div>
        </CalendarWrapper>
    );
};