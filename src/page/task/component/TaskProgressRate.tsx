import React from "react";
import {calculateProgressRate} from "../../../util/TaskUtil";
import {TaskStatus} from "../../../api/task/TaskTypes";

interface TaskProgressRateProps {
	status: TaskStatus,
	itemsCount: number,
	completedCount: number,
}

export const TaskProgressRate: React.FC<TaskProgressRateProps> = ({status, itemsCount, completedCount}) => {
	
	const progressRate = calculateProgressRate(status, itemsCount, completedCount);
	return (
		<div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
			<div className="absolute top-0 left-0 h-full bg-primary transition-all w-full"
			     style={{width: `${progressRate}%`}}
			     aria-label={`Task progress: ${progressRate}%`}/>
			<div className="flex justify-between items-center mt-2">
				{itemsCount > 0 && (
					<span className="text-gray-500 text-xs"
					      aria-label={`Completed items: ${completedCount}/${itemsCount}`}>
						({completedCount}/{itemsCount})
					</span>
				)}
				<span className="text-gray-700 font-bold text-xs"
				      aria-label={`Task progress: ${progressRate}%`}>
					{progressRate}%
				</span>
			</div>
		</div>
	);
};