import React from "react";
import {useTaskModal} from "./TaskModalContext";
import {TaskStatus} from "../../api/task/TaskTypes";

export const TaskBoardHeader: React.FC<{ taskStatus: TaskStatus }> = ({ taskStatus }) => {
    const {openTaskModal} = useTaskModal();
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">{taskStatus}</h2>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={() => openTaskModal(taskStatus)}>+</button>
        </div>
    );
};
