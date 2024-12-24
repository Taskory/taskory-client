import React from "react";
import {CardType} from "../../../api/task/TaskTypes";
import {useTaskModal} from "../../../modal/context/TaskModalContext";
import {useTaskDragDrop} from "../context/TaskDragDropContext";
import {StatusMsgBadge} from "../../../component/StatusMsgBadge";
import {TagColor} from "../../../api/tag/TagTypes";
import {TagBadge} from "../../../component/TagBadge";
import {StatusBadge} from "../../../component/StatusBadge";
import {TaskProgressRate} from "./TaskProgressRate";
import {TaskHashtagList} from "./TaskHashtagList";

export const TaskCard: React.FC<CardType> = ({task}) => {
	const {openTaskModal} = useTaskModal();
	const {useTaskDrag} = useTaskDragDrop();
	const [, drag] = useTaskDrag(task);

	const handleCardClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		openTaskModal(task.id);
	};

	

	return (
		<>
			<div className="card w-full bg-white shadow-md border border-gray-200 rounded-md p-2 gap-1">
				{/* 1st line: Task Title, Task Status, Task Tag */}
				<div className="flex items-center justify-between w-full">
					<h2 className="text-sm font-semibold text-gray-800 truncate w-1/2">{task.title}</h2>
					<div className="flex items-center space-x-1">
						<StatusBadge status={task.status}/>
						<TagBadge tagColor={task.tagColor as TagColor} tagTitle={task.tagTitle}/>
					</div>
				</div>
				
				{/* 2nd line: Status message badge, Event Title */}
				<div className="flex items-center justify-between text-xs text-gray-600">
					<StatusMsgBadge deadline={task.deadline} status={task.status}/>
					<p className="text-gray-600 text-xs truncate" title={task.event?.title ?? "No Event"}>
						{task.event ? task.event.title : "No Event"}
					</p>
				</div>
				
				{/* 3rd line: Task Hashtags + Progress */}
				<div className="flex items-center justify-between text-xs">
					<TaskHashtagList hashtags={task.hashtags} />
					<TaskProgressRate status={task.status} itemsCount={task.itemsCount} completedCount={task.completedItemsCount} />
				</div>
				<button ref={drag} className={`absolute top-0 left-0 w-full h-full opacity-0`}
				        onClick={handleCardClick}/>
			</div>
		</>
	);
};