import {TaskStatus } from "../api/task/TaskTypes";
import {CollectedPropsType} from "../page/task/context/TaskDragDropContext";

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

