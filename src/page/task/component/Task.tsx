import React from "react";
import {TaskSummary} from "../../../api/task/TaskTypes";
import {useTaskModal} from "../context/TaskModalContext";

interface TaskProps {
    task: TaskSummary;
}

export const Task: React.FC<TaskProps> = ({ task }) => {
    const {openTaskModal} = useTaskModal();
    return (
        <div className="bg-gray-100 p-3 rounded-md shadow-sm border border-gray-300 hover:bg-gray-200 transition"
             onClick={() => openTaskModal(task.id)}>
            <p className="text-gray-800 font-bold">{task.title}</p>
            {task.event && <p className="text-sm text-gray-600">Event: {task.event.title}</p>}
            {task.tagTitle && <span
                className="inline-block bg-blue-200 text-blue-800 rounded px-2 py-1 text-xs">{task.tagTitle}</span>}
        </div>
    );
};
