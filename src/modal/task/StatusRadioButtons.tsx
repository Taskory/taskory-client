import {TaskStatus} from "../../api/task/TaskTypes";
import {getSelectedStatusStyle, getUnselectedStatusStyle} from "../../component/StatusBadge";
import React from "react";

interface StatusSelectorProps {
	status: TaskStatus;
	setStatus: React.Dispatch<React.SetStateAction<TaskStatus>>;
}

export const StatusRadioButtons: React.FC<StatusSelectorProps> = ({status, setStatus}) => {
	const statusList = Object.values(TaskStatus);
	return (
		<>
			{statusList.map((item) => (
				< label key={item} className="cursor-pointer flex-1">
					<input
						type="radio"
						name="status"
						className="hidden"
						value={item}
						checked={status === item}
						onChange={() => setStatus(item)}
					/>
					<div
						className={`w-full text-center py-2 border-2 rounded-lg text-xs font-bold transition-colors items-center
	                                                ${status === item ? getSelectedStatusStyle(item) : getUnselectedStatusStyle(item)}`}
					>
						{item}
					</div>
				</label>
			))}
		</>
	);
};