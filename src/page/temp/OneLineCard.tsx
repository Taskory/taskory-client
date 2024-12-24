import React from "react";

export const OneLineCard: React.FC = () => {
	const tempData = {
		taskTitle: "Design Landing Page",
		taskStatus: "In Progress",
		taskTag: "UI/UX",
		remainingTime: "3 days left",
	};

	return (
		<div className="card w-full bg-base-100 shadow-sm border border-gray-200 rounded-md p-2 flex items-center text-sm space-x-4">
			{/* Task Title */}
			<h2 className="font-semibold text-gray-800 truncate flex-1">{tempData.taskTitle}</h2>

			{/* Task Status */}
			<span
				className={`badge ${tempData.taskStatus === 'Completed' ? 'badge-success' : 'badge-info'} text-[10px] py-1 px-2`}
			>
        {tempData.taskStatus}
      </span>

			{/* Task Tag */}
			<span className="badge badge-outline badge-primary text-[10px] py-1 px-2">{tempData.taskTag}</span>

			{/* Remaining Time */}
			<p className="text-xs text-gray-600 whitespace-nowrap">{tempData.remainingTime}</p>
		</div>
	);
};
