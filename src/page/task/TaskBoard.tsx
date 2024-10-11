import React, { useEffect } from "react";
import { Task } from "./Task";
import { TaskBoardHeader } from "./TaskBoardHeader";
import { TaskSummary } from "../../api/task/TaskTypes";
import { useTaskContext } from "../../context/TaskContext";

interface TaskBoardProps {
    data: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ data }) => {
    const { TO_DO, IN_PROGRESS, DONE } = useTaskContext();
    const [tasks, setTasks] = React.useState<TaskSummary[]>([]);

    // useEffect to update tasks when data changes
    useEffect(() => {
        switch (data) {
            case "TO_DO":
                setTasks(TO_DO);
                break;
            case "IN_PROGRESS":
                setTasks(IN_PROGRESS);
                break;
            case "DONE":
                setTasks(DONE);
                break;
            default:
                setTasks([]);
                break;
        }
    }, [data, TO_DO, IN_PROGRESS, DONE]); // Dependencies to ensure tasks are updated correctly

    return (
        <div className="w-1/3 bg-white shadow-md rounded-md p-2 border border-gray-200 flex flex-col h-[calc(100vh-10rem)]">
            <TaskBoardHeader title={data} />
            <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                {/* Render the Task component for each task in the tasks array */}
                {tasks.length > 0 ? (
                    tasks.map((task) => <Task key={task.id} task={task} />)
                ) : (
                    <p>No tasks available</p> // Handle case where no tasks are available
                )}
            </div>
        </div>
    );
};
