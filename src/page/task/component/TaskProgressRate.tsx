import React from "react";
import { calculateProgressRate } from "../../../util/TaskUtil";
import { TaskStatus } from "../../../api/task/TaskTypes";

interface TaskProgressRateProps {
	status: TaskStatus;
	itemsCount: number;
	completedCount: number;
}

export const TaskProgressRate: React.FC<TaskProgressRateProps> = ({
	                                                                  status,
	                                                                  itemsCount,
	                                                                  completedCount,
                                                                  }) => {
	
	const progressRate = calculateProgressRate(status, itemsCount, completedCount);
	
	return (
		<div className="flex items-center space-x-3 w-full max-w-md">
			{/* Progress Text */}
			{itemsCount > 0 && (
				<span
					className="text-xs text-gray-600"
					aria-label={`Completed items: ${completedCount}/${itemsCount}`}
				>
          {`${completedCount}/${itemsCount}`}
        </span>
			)}
			{/* Progress Bar */}
			<div className="flex-1 h-3 bg-base-300 rounded-full overflow-hidden">
				<div
					className="h-full bg-primary transition-all"
					style={{ width: `${progressRate}%` }}
					aria-label={`Task progress: ${progressRate}%`}
				></div>
			</div>
			{/* Progress Percentage */}
			<span
				className="text-xs font-bold text-gray-700"
				aria-label={`Task progress: ${progressRate}%`}
			>
        {progressRate}%
      </span>
		</div>
	);
};
