import React, {createContext, JSX, useCallback, useContext, useMemo, useState} from "react";
import {DndProvider, DragSourceMonitor, DropTargetMonitor, useDrag, useDragLayer, useDrop} from "react-dnd";
import { ItemType } from "../../../api/task/TaskApi";
import { TaskStatus, TaskSummary } from "../../../api/task/TaskTypes";
import { useTaskContext } from "../../../context/data/TaskContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import {getTagColorStyle} from "../../../util/TagUtil";

interface TaskDragDropContextType {
    useTaskDrag: (task: TaskSummary) => ReturnType<typeof useDrag>;
    useTaskDrop: (taskStatus: TaskStatus) => ReturnType<typeof useDrop<TaskSummary, void, CollectedPropsType>>;
    renderDropDisplay: (collectedProps: CollectedPropsType,  boardStatus: TaskStatus) => JSX.Element
}

const TaskDragDropContext = createContext<TaskDragDropContextType | undefined>(undefined);

// Type for the collected properties
export interface CollectedPropsType {
    isOver: boolean;
    canDrop: boolean;
}

const useTaskDrag = (task: TaskSummary, setSelectedTaskStatus: React.Dispatch<React.SetStateAction<TaskStatus | null>>) => {
    return useDrag(() => ({
        type: ItemType,
        item: { ...task },
        collect: (monitor: DragSourceMonitor) => {
            if (monitor.isDragging()) {
                const selectedTask = monitor.getItem() as TaskSummary;
                setSelectedTaskStatus(selectedTask.status);
            }
        }
    }), [task]);
};

// Custom hook for task drop logic
const useTaskDrop = (
    taskStatus: TaskStatus,
    moveTaskItem: (task: TaskSummary, newStatus: TaskStatus) => void
) => {
    return useDrop<TaskSummary, void, CollectedPropsType>({
        accept: ItemType,
        drop: (draggedItem: TaskSummary) => {
            if (draggedItem?.status !== taskStatus) {
                moveTaskItem(draggedItem, taskStatus);
            }
        },
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
};


export const TaskDragDropProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {moveTaskItem} = useTaskContext();
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null)
    // Custom hook for task drag logic


    const renderDropDisplay = useCallback((collectedProps: CollectedPropsType, boardStatus: TaskStatus): JSX.Element => {
        return (
            <>
                {collectedProps.isOver && collectedProps.canDrop && boardStatus !== selectedTaskStatus && (
                    <div
                        className="absolute inset-0 bg-green-100 bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
                        <p className="text-green-700 font-medium">Drop here</p>
                    </div>
                )}
            </>
        );
    }, [selectedTaskStatus]);

    const contextValue: TaskDragDropContextType = useMemo(() => ({
        useTaskDrag: (task: TaskSummary) => useTaskDrag(task, setSelectedTaskStatus),
        useTaskDrop: (taskStatus: TaskStatus) => useTaskDrop(taskStatus, moveTaskItem),
        renderDropDisplay,
    }), [moveTaskItem, renderDropDisplay]);

    return (
        <DndProvider backend={HTML5Backend}>
            <TaskDragDropContext.Provider value={contextValue}>
                {children}
                <CustomDragLayer/>
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

const CustomDragLayer: React.FC = () => {
    const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem() as TaskSummary,
        isDragging: monitor.isDragging(),
        currentOffset: monitor.getClientOffset(),
    }));

    if (!isDragging || !currentOffset) return null;

    return (
        <div
            className="fixed pointer-events-none z-[1000] w-64 h-16"
            style={{
                top: currentOffset.y - 16,
                left: currentOffset.x - 128,
            }}
        >
            <div
                className="bg-white border-2 text-black p-4 rounded-md shadow-xl flex items-center justify-between gap-3">
                <div className="flex flex-col">
                    <span className="text-sm font-bold truncate">{item.title}</span>
                    <span className="text-xs text-gray-300">
                        {item.completedItemsCount}/{item.itemsCount} completed
                    </span>
                </div>
                <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium truncate ${getTagColorStyle(item.tagColor ?? "")}`}
                    title={item.tagTitle ?? ""}
                >
                        {item.tagTitle ?? "No Tag"}
                    </span>

            </div>
        </div>
    );
};
