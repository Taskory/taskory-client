import React, { createContext, useContext, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { ItemType } from "../../../api/task/TaskApi";
import { TaskStatus, TaskSummary } from "../../../api/task/TaskTypes";
import { useTaskContext } from "../../../context/data/TaskContext";
import { HTML5Backend } from "react-dnd-html5-backend";

interface TaskDragDropContextType {
    useTaskDrag: (task: TaskSummary) => ReturnType<typeof useDrag>;
    useTaskDrop: (taskStatus: TaskStatus) => ReturnType<typeof useDrop>;
}

const TaskDragDropContext = createContext<TaskDragDropContextType | undefined>(undefined);

// Custom hook for task drag logic
const useTaskDrag = (task: TaskSummary) => {
    return useDrag(() => ({
        type: ItemType,
        item: { ...task },
    }), [task]);
};

// Custom hook for task drop logic
const useTaskDrop = (taskStatus: TaskStatus, moveTaskItem: (task: TaskSummary, newStatus: TaskStatus) => void) => {
    return useDrop<TaskSummary, void, void>({
        accept: ItemType,
        drop: (draggedItem) => {
            if (draggedItem.status !== taskStatus) {
                moveTaskItem(draggedItem, taskStatus);
            }
        },
    });
};

export const TaskDragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { moveTaskItem } = useTaskContext();

    const contextValue: TaskDragDropContextType = useMemo(() => ({
        useTaskDrag,
        useTaskDrop: (taskStatus: TaskStatus) => useTaskDrop(taskStatus, moveTaskItem),
    }), [moveTaskItem]);

    return (
        <DndProvider backend={HTML5Backend}>
            <TaskDragDropContext.Provider value={contextValue}>
                {children}
            </TaskDragDropContext.Provider>
        </DndProvider>
    );
};

export const useTaskDragDrop = (): TaskDragDropContextType => {
    const context = useContext(TaskDragDropContext);
    if (context === undefined) {
        throw new Error('useTaskDragDrop must be used within a TaskDragDropProvider');
    }
    return context;
};
