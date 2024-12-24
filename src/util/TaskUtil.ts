import {TaskStatus } from "../api/task/TaskTypes";
import {CollectedPropsType} from "../page/task/context/TaskDragDropContext";
import {TimeUtil} from "./TimeUtil";

export function calculateProgressRate(status: TaskStatus, itemsCount: number, completedCount: number): number {
	if (itemsCount > 0) {
		return Math.round((completedCount / itemsCount) * 100);
	} else {
		if (status === TaskStatus.DONE) {
			return 100;
		} else {
			return 0;
		}
	}
}

export function getDropStyle(collectedProps: CollectedPropsType) {
	return collectedProps.isOver && collectedProps.canDrop ? `border-green-300 bg-green-50 shadow-lg shadow-green-300` : `border-gray-300`;
}

export function getDeadline(deadline: string, status: TaskStatus, dueDateTime: string | null): string {
	switch (status) {
		case TaskStatus.TODO:
		case TaskStatus.PROGRESS:
			if (deadline && deadline.length > 0) {
				return deadline;
			} else {
				const currentDateTime = new Date();
				const defaultDateTime = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() + 7);
				if (dueDateTime) {
					const eventDueDateTime = TimeUtil.dateTimeToDate(TimeUtil.stringToDateTime(dueDateTime));
					
					if (eventDueDateTime.getTime() < defaultDateTime.getTime()) {
						return TimeUtil.dateToString(eventDueDateTime);
					} else {
						return TimeUtil.dateToString(defaultDateTime);
					}
				} else {
					return TimeUtil.dateToString(defaultDateTime);
				}
			}
		case TaskStatus.BACKLOG:
			return "";
		case TaskStatus.DONE:
			if (deadline && deadline.length > 0) {
				return deadline;
			} else return "";
		default:
			return "";
	}
}