import {TaskStatus, TaskSummary} from "../api/task/TaskTypes";

export function calculateProgressRate(task: TaskSummary): number {
    if (task.itemsCount > 0) {
        return task.completedItemsCount / task.itemsCount * 100;
    } else {
        if (task.status === TaskStatus.DONE) {
            return 100;
        } else {
            return 0;
        }
    }
}