import {TaskStatus} from "../../../../../api/task/TaskTypes";
import {TaskBoardHeader} from "../../TaskBoardHeader";
import React from "react";
import {useTaskContext} from "../../../../../context/data/TaskContext";
import {DoneCard} from "../card/DoneCard";
import {useTaskDragDrop} from "../../../context/TaskDragDropContext";

export const DoneBoard = () => {
    const { DONE } = useTaskContext();
    const taskStatus: TaskStatus = TaskStatus.DONE;

    const {useTaskDrop} = useTaskDragDrop();

    const [, drop] = useTaskDrop(taskStatus);
    return (
        <>
            <div className="w-full bg-white shadow-md rounded-md p-2 border border-gray-200 flex flex-col"
                 ref={drop}>
                <TaskBoardHeader taskStatus={taskStatus} key={taskStatus}/>
                <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                    {/* Render the Task component for each task in the tasks array */}
                    {DONE.length > 0 ? (
                        DONE.map((task) => <DoneCard key={`${task.status}-${task.id}`} task={task}/>)
                    ) : (
                        <p>No tasks available</p> // Handle case where no tasks are available
                    )}
                </div>
            </div>
        </>
    );
};