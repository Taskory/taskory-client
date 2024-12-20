import React from "react";
import { TaskStatus } from "../api/task/TaskTypes";

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
	return (
		<div
			className={`inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded transition-colors duration-200 ${getStatusStyle(
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
			return "bg-blue-200 text-blue-600";
		case TaskStatus.TODO:
			return "bg-green-200 text-green-600";
		case TaskStatus.PROGRESS:
			return "bg-yellow-200 text-yellow-600 ";
		case TaskStatus.DONE:
			return "bg-purple-200 text-purple-600";
	}
};

export const getSelectedStatusStyle = (status: TaskStatus) => {
	switch (status) {
		case TaskStatus.BACKLOG:
			return 'bg-blue-600 text-white';
		case TaskStatus.TODO:
			return 'bg-green-500 text-white';
		case TaskStatus.PROGRESS:
			return 'bg-yellow-300 text-white';
		case TaskStatus.DONE:
			return 'bg-purple-500 text-white';
	}
};

export const getUnselectedStatusStyle = (status: TaskStatus) => {
	switch (status) {
		case TaskStatus.BACKLOG:
			return 'bg-gray-50 text-blue-700 hover:bg-blue-200';
		case TaskStatus.TODO:
			return 'bg-green-50 text-green-500 hover:bg-green-200';
		case TaskStatus.PROGRESS:
			return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-200';
		case TaskStatus.DONE:
			return 'bg-purple-50 text-purple-600 hover:bg-purple-200';
	}
};


