import {TaskStatus} from "../api/task/TaskTypes";

export const getStatusStyle = (status: string) => {
    switch (status) {
        case TaskStatus.BACKLOG:
            return 'bg-green-100 text-green-800';
        case TaskStatus.TODO:
            return 'bg-red-100 text-red-800';
        case TaskStatus.PROGRESS:
            return 'bg-yellow-100 text-yellow-800';
        case TaskStatus.DONE:
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
