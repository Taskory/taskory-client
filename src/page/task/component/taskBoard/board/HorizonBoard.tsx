import React, { useEffect, useRef, useState } from "react";
import { TaskStatus, TaskSummary } from "../../../../../api/task/TaskTypes";
import { useTaskContext } from "../../../../../context/data/TaskContext";
import { useTaskDragDrop } from "../../../context/TaskDragDropContext";
import { OneLineTaskCard } from "../card/OneLineTaskCard";
import { useTaskModal } from "../../../../../context/modal/TaskModalContext";

export const HorizonBoard: React.FC<{ taskStatus: TaskStatus }> = ({ taskStatus }) => {
    const { BACKLOG, DONE } = useTaskContext();
    const [tasks, setTasks] = useState<TaskSummary[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (taskStatus === TaskStatus.DONE) setTasks(DONE);
        else if (taskStatus === TaskStatus.BACKLOG) setTasks(BACKLOG);
    }, [BACKLOG, DONE, taskStatus]);

    const { useTaskDrop } = useTaskDragDrop();
    const { openTaskModal } = useTaskModal();

    const [, drop] = useTaskDrop(taskStatus);

    const [isOpen, setIsOpen] = useState(true);
    const toggleBoard = () => setIsOpen((prev) => !prev);

    return (
        <div
            className="w-full bg-gray-50 shadow rounded-md p-3 border border-gray-300 grid transition-all duration-300"
            ref={drop}
        >
            {/* 보드 헤더 */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleBoard}
                        className="text-gray-600 hover:text-blue-500 transition font-medium text-sm"
                        aria-label={isOpen ? "Collapse board" : "Expand board"}
                    >
                        {isOpen ? "▼" : "▶"}
                    </button>
                    <h2 className="text-sm font-bold text-gray-700">{taskStatus}</h2>
                </div>
                <button
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => openTaskModal(taskStatus)}
                >
                    + Add
                </button>
            </div>

            {/* 보드 내용 */}
            <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[1000px]" : "max-h-0"
                }`}
                ref={contentRef}
            >
                <div className="mt-2 flex flex-col gap-1">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <OneLineTaskCard key={`${task.status}-${task.id}`} task={task} />
                        ))
                    ) : (
                        <p className="text-xs text-gray-500 text-center">No tasks</p>
                    )}
                </div>
            </div>
        </div>
    );
};
