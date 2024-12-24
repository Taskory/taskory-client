import {TaskStatus, TaskSummary} from "../../../api/task/TaskTypes";
import React, {useEffect, useState} from "react";
import {useTaskContext} from "../../../context/data/TaskContext";
import {useTaskDragDrop} from "../context/TaskDragDropContext";
import {useTaskModal} from "../../../modal/context/TaskModalContext";
import {getDropStyle} from "../../../util/TaskUtil";
import {TaskCard} from "./TaskCard";



export const StaticTaskBoard: React.FC<{boardStatus: TaskStatus}> = ({boardStatus}) => {
    const { TODO, PROGRESS } = useTaskContext();
    const {openTaskModal} = useTaskModal();
    const {useTaskDrop, renderDropDisplay} = useTaskDragDrop();

    const [tasks, setTasks] = useState<TaskSummary[]>([]);

    useEffect(() => {
        if (boardStatus === TaskStatus.TODO) setTasks(TODO);
        else if (boardStatus === TaskStatus.PROGRESS) setTasks(PROGRESS);
    }, [PROGRESS, TODO, boardStatus]);

    const [collectedProps, drop] = useTaskDrop(boardStatus);

    return (
        <div
            className={`relative w-full bg-gray-50 hover:bg-gray-100 shadow-sm rounded-md p-3 border flex flex-col 
            ${getDropStyle(collectedProps)}`}
            ref={drop}
        >
            {renderDropDisplay(collectedProps, boardStatus)}
            {/* Header */}
            <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-700">{boardStatus}</h2>
                </div>
                <button
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => openTaskModal(boardStatus)}
                >
                    + Add
                </button>
            </div>

            {/* Contents */}
            <div className="grid gap-2">
                {/* Render the Task component for each task in the tasks array */}
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskCard key={`${task.status}-${task.id}`} task={task}/>)
                ) : (
                    <p className="text-xs text-gray-500 text-center">No tasks</p> // Handle case where no tasks are available
                )}
            </div>
        </div>

    );
            };