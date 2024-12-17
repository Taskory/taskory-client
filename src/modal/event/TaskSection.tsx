import React, {SetStateAction, useCallback, useMemo, useState} from "react";
import {TaskStatus} from "../../api/task/TaskTypes";
import {SavedTaskCard} from "./SavedTaskCard";
import {TaskInEventDto} from "../../api/event/EventsTypes";

interface TaskListProps {
	items: TaskInEventDto[],
	setItems: React.Dispatch<SetStateAction<TaskInEventDto[]>>;
}

export const TaskSection: React.FC<TaskListProps> = ({items, setItems}) => {
	const [newTaskTitle, setNewTaskTitle] = useState<string>('');

	const handleAddTaskItem = useCallback(() => {
		if (newTaskTitle.trim() !== '') {
			const newTaskItem: TaskInEventDto = {
				id: Date.now() * (-1),  // Temporary ID
				title: newTaskTitle,
				status: TaskStatus.BACKLOG
			};
			setItems([...items, newTaskItem]);
			setNewTaskTitle('');
		}
	}, [items, newTaskTitle, setItems]);

	const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTaskItem();
		} else if (e.key === 'Escape') {
			e.currentTarget.blur(); // Removes focus from the input
		}
	}, [handleAddTaskItem]);

	/* Progress Calculation */
	const calculateProgress = useMemo((): number => {
		if (items.length === 0) return 0;
		const completedItems = items.filter(item => (item.status === TaskStatus.DONE)).length;
		return Math.round((completedItems / items.length) * 100);
	}, [items]);

	return (
		<>
			<label className="label text-sm justify-end mr-1">Tasks</label>
			<div className="col-span-3 flex items-center gap-2">
				<input
					type="text"
					className="input input-bordered input-sm flex-1 focus:outline-none focus:border-blue-500"
					placeholder="New checklist item"
					value={newTaskTitle}
					onChange={(e) => setNewTaskTitle(e.target.value)}
					onKeyDown={handleKeyPress}
				/>
				<button type="button" className="btn btn-primary btn-sm"
				        onClick={handleAddTaskItem}>
					Add
				</button>
			</div>
			<div className="col-span-4 mt-4">
				<div className="w-full bg-gray-200 rounded-full h-4">
					<div
						className="bg-blue-600 h-4 rounded-full text-xs font-medium text-center text-white"
						style={{width: `${calculateProgress}%`}}
					>
						{calculateProgress}%
					</div>
				</div>
			</div>
			<ul
				className="col-span-4 space-y-2 h-52 overflow-y-auto mt-2 relative"
			>
				{items.map((item, index) => (
					<SavedTaskCard key={index} item={item} setItems={setItems}/>
				))}
			</ul>
		</>
	);
};
