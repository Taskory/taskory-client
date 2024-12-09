import {TaskStatus, TaskSummary} from "../../../../../api/task/TaskTypes";
import React, {useEffect, useState} from "react";
import {useTaskContext} from "../../../../../context/data/TaskContext";
import {useTaskDragDrop} from "../../../context/TaskDragDropContext";
import {useTaskModal} from "../../../../../context/modal/TaskModalContext";
import {MultiLineTaskCard} from "../card/MultiLineTaskCard";

export const VerticalBoard: React.FC<{taskStatus: TaskStatus}> = ({taskStatus}) => {
    const { TODO, PROGRESS } = useTaskContext();
    const {openTaskModal} = useTaskModal();

    const [tasks, setTasks] = useState<TaskSummary[]>([]);

    useEffect(() => {
        if (taskStatus === TaskStatus.TODO) setTasks(TODO);
        else if (taskStatus === TaskStatus.PROGRESS) setTasks(PROGRESS);
    }, [PROGRESS, TODO, taskStatus]);

    const {useTaskDrop} = useTaskDragDrop();

    const [, drop] = useTaskDrop(taskStatus);

    return (
        <div
            className="w-full bg-gray-50 shadow rounded-md p-2 border border-gray-300 flex flex-col"
            ref={drop}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-700">{taskStatus}</h2>
                </div>
                <button
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => openTaskModal(taskStatus)}
                >
                    + Add
                </button>
            </div>

            {/* Contents */}
            <div className="grid gap-2">
                {/* Render the Task component for each task in the tasks array */}
                {tasks.length > 0 ? (
                    tasks.map((task) => <MultiLineTaskCard key={`${task.status}-${task.id}`} task={task}/>)
                ) : (
                    <p className="text-xs text-gray-500 text-center">No tasks</p> // Handle case where no tasks are available
                )}
            </div>
        </div>

    );
};