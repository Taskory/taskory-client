import React from "react";
import { TaskStatus } from "../api/task/TaskTypes";

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
	return (
		<div
			className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded transition-colors duration-200 ${getStatusStyle(
				status
			)}`}
			aria-label={`Status: ${status}`}
		>
			{status}
		</div>
	);
};

const getStatusStyle = (status: TaskStatus) => {
	switch (status) {
		case TaskStatus.BACKLOG:
			return "bg-gray-200 text-gray-600";
		case TaskStatus.TODO:
			return "bg-blue-200 text-blue-600";
		case TaskStatus.PROGRESS:
			return "bg-yellow-200 text-yellow-600 ";
		case TaskStatus.DONE:
			return "bg-green-200 text-green-600";
		default:
			return "bg-gray-200 text-gray-600";
	}
};
