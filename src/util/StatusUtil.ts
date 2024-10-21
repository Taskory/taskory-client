import {TaskStatus} from "../api/task/TaskTypes";

export const getStatusStyle = (status: string) => {
    switch (status) {
        case TaskStatus.DONE:
            return 'bg-green-100 text-green-800';
        case TaskStatus.IN_PROGRESS:
            return 'bg-yellow-100 text-yellow-800';
        case TaskStatus.TO_DO:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
