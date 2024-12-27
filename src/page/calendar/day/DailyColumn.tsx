import {DayColumn} from "../common/DayColumn";
import React from "react";
import {EventSummary} from "../../../api/event/EventsTypes";

interface DailyColumnProps {
	events: EventSummary[]
}

export const DailyColumn: React.FC<DailyColumnProps> = ({events}) => {
	return (
		<>
			<div className="col-span-7">
				<DayColumn events={events}/>
			</div>
		</>
	);
};