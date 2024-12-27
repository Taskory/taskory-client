import React from "react";
import { useCalendar } from "../context/CalendarContext";
import calendar from "../../../constants/calendar.json"
import {useScrollBar} from "../context/ScrollBarContext";


// Header common for weekday names
export const DailyTopBar: React.FC = () => {
	const { currentDate } = useCalendar();
	const {scrollBarWidth} = useScrollBar();
	
	// Extract day of the week (0 = Sunday, 6 = Saturday)
	const dayOfWeek = currentDate.getDay();
	
	// Get the day string from the JSON data
	const dayString = calendar.daysOfWeek[dayOfWeek];
	
	// Conditionally apply text color based on the day
	const textColor = dayString === "Sat" ? "text-blue-500" : dayString === "Sun" ? "text-red-500" : "";
	
	return (
		<div className="bg-white grid grid-cols-timetable border-b" style={{marginRight: scrollBarWidth}}>
			<div className="border-r"/>
			<div className="border-r h-8 flex justify-center items-center font-bold col-span-7">
				<p className="text-center">{currentDate.getDate()}</p>
				<p>(</p>
				{/* Apply dynamic color to the dayString */}
				<p className={`text-center ${textColor}`}>{dayString}</p>
				<p>)</p>
			</div>
		</div>
	);
};
