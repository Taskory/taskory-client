import React from "react";
import { Task } from "./Task";
import { TaskBoardHeader } from "./TaskBoardHeader";
import {TaskSummary} from "../../api/task/TaskTypes";

interface TaskBoardProps {
    title: string;
    tasks: TaskSummary[]; // Added tasks prop to accept an array of tasks
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ title, tasks }) => {
    return (
        <div className="w-1/3 bg-white shadow-md rounded-md p-2 border border-gray-200 flex flex-col h-[calc(100vh-10rem)]">
            <TaskBoardHeader title={title} />
            <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                {/* Render the Task component for each task in the tasks array */}
                {tasks.length > 0 ? (
                    tasks.map((task) => <Task key={task.id} task={task} />)
                ) : (
                    <p>No tasks available</p>  // Handle case where no tasks are available
                )}
            </div>
        </div>
    );
};
