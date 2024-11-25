import React, {useEffect} from "react";
import {TaskBoardHeader} from "./TaskBoardHeader";
import {TaskStatus, TaskSummary} from "../../../api/task/TaskTypes";
import {useTaskContext} from "../../../context/data/TaskContext";
import { TaskCard } from "./TaskCard";
import {useDrop} from "react-dnd";
import {ItemType} from "../../../api/task/TaskApi";

interface TaskBoardProps {
    taskStatus: TaskStatus;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ taskStatus }) => {
    const { TO_DO, IN_PROGRESS, DONE, moveTaskItem } = useTaskContext();
    const [tasks, setTasks] = React.useState<TaskSummary[]>([]);

    const [, drop] = useDrop({
        accept: ItemType,
        drop: (draggedItem: TaskSummary) => {
            if (draggedItem.status !== taskStatus) {
                moveTaskItem(draggedItem, taskStatus);
            }
        },
    });

    // useEffect to update tasks when data changes
    useEffect(() => {
        switch (taskStatus) {
            case TaskStatus.TO_DO:
                setTasks(TO_DO);
                break;
            case TaskStatus.IN_PROGRESS:
                setTasks(IN_PROGRESS);
                break;
            case TaskStatus.DONE:
                setTasks(DONE);
                break;
            default:
                setTasks([]);
                break;
        }
    }, [taskStatus, TO_DO, IN_PROGRESS, DONE]); // Dependencies to ensure tasks are updated correctly


    return (
        <div className="w-1/3 bg-white shadow-md rounded-md p-2 border border-gray-200 flex flex-col h-[calc(100vh-10rem)]"
             ref={drop} >
            <TaskBoardHeader taskStatus={taskStatus} key={taskStatus} />
            <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                {/* Render the Task component for each task in the tasks array */}
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskCard key={`${task.status}-${task.id}`} task={task} />)
                ) : (
                    <p>No tasks available</p> // Handle case where no tasks are available
                )}
            </div>
        </div>
    );
};
