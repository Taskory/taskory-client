// StatusMsgBadge.tsx
import { TaskStatus } from "../api/task/TaskTypes";
import React, { useEffect, useState } from "react";
import { TimeUtil } from "../util/TimeUtil";

/* Status Config style*/
const STATUS_CONFIG = {
	[TaskStatus.DONE]: {
		msg: "Completed",
		style: "text-white",
		bgColor: "bg-purple-500",
	},
	[TaskStatus.BACKLOG]: {
		msg: "In planning phase",
		style: "text-white",
		bgColor: "bg-blue-600",
	},
};

/* Props */
interface StatusMsgBadgeProps {
	deadline: string;
	status: TaskStatus;
}

/* Component */
export const StatusMsgBadge: React.FC<StatusMsgBadgeProps> = ({ deadline, status }) => {
	/* State Management*/
	const [badgeConfig, setBadgeConfig] = useState({ msg: "", style: "", bgColor: "" });

	/* useEffect */
	useEffect(() => {
		if (status === TaskStatus.DONE || status === TaskStatus.BACKLOG) {
			setBadgeConfig(STATUS_CONFIG[status]);
			return;
		}

		if (deadline && deadline.length > 0) {
			// Deadline is not empty
			const deadlineDate = TimeUtil.stringToDate(deadline);
			const now = new Date();
			const diffInMilliseconds = deadlineDate.getTime() - now.getTime();
			const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

			if (daysLeft < 0) {
				// OverDue
				setBadgeConfig({
					msg: `Overdue by ${Math.abs(daysLeft)} days`,
					style: "text-white",
					bgColor: "bg-red-600",
				});
			} else if (daysLeft === 0) {
				// Due
				setBadgeConfig({
					msg: "Due today",
					style: "text-white",
					bgColor: "bg-yellow-300",
				});
			} else if (daysLeft === 1) {
				setBadgeConfig({
					msg: "Due tomorrow",
					style: "text-white",
					bgColor: "bg-yellow-300",
				});
			} else {
				// Remaining
				setBadgeConfig({
					msg: `${daysLeft} days remaining`,
					style: "text-white",
					bgColor: "bg-green-500",
				});
			}
		} else {
			// Deadline is empty value
			setBadgeConfig({
				msg: "No deadline set",
				style: "text-white",
				bgColor: "bg-gray-500",
			});
		}
	}, [deadline, status]);

	/* Rendering */
	return (
		<div className={`flex items-center ${badgeConfig.bgColor} 
		inline-flex items-center px-1.5 py-0.5 rounded-full`}>
			<p className={`text-xs font-medium ${badgeConfig.style}`}>{badgeConfig.msg}</p>
		</div>
	);
};
