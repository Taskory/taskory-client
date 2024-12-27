import React from "react";
import { CalendarTopBar } from "./CalendarTopBar";
import {CalendarWrapper} from "./CalendarWrapper";
import { CalendarContents } from "./CalendarContents";

export const CalendarPage = () => {
	
	return (
		<CalendarWrapper>
			<div className="flex flex-col h-full">
				<CalendarTopBar/>
				<CalendarContents />
			</div>
		</CalendarWrapper>
	);
};