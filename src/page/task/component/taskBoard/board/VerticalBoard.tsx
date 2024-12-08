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
        <>
            <div
                className="w-full bg-gray-50 shadow-lg rounded-lg p-4 border border-gray-300 flex flex-col"
                ref={drop}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">{taskStatus}</h2>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            onClick={() => openTaskModal(taskStatus)}>+
                    </button>
                </div>
                <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                    {/* Render the Task component for each task in the tasks array */}
                    {tasks.length > 0 ? (
                        tasks.map((task) => <MultiLineTaskCard key={`${task.status}-${task.id}`} task={task}/>)
                    ) : (
                        <p className="text-xs text-gray-500 text-center">No tasks</p> // Handle case where no tasks are available
                    )}
                </div>
            </div>
        </>
    );
};