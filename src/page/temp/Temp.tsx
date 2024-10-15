import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CommonLayout } from "../../layout/CommonLayout";
import { TaskStatus, TaskSummary } from "../../api/task/TaskTypes";
import {ItemType} from "../../api/task/TaskApi";

// 단일 아이템 타입 정의


interface TaskItemProps {
    task: TaskSummary;
}

// Draggable item component
const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [, drag] = useDrag(() => ({
        type: ItemType,
        item: { id: task.id, taskStatus: task.status },
    }));

    return (
        <div ref={drag} className="p-4 bg-white rounded shadow hover:bg-gray-100">
            {task.title}
        </div>
    );
};

interface TaskBoardProps {
    items: TaskSummary[];
    status: TaskStatus;
    moveItem: (id: number, fromContainerId: TaskStatus, toContainerId: TaskStatus) => void;
}

// Droppable container component
const TaskBoard: React.FC<TaskBoardProps> = ({ items, status, moveItem }) => {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (draggedItem: { id: number; taskStatus: TaskStatus }) => {
            if (draggedItem.taskStatus !== status) {
                moveItem(draggedItem.id, draggedItem.taskStatus, status);
            }
        },
    });

    return (
        <div ref={drop} className="space-y-2 p-2 board bg-gray-200 min-h-[200px]">
            {items.map((item) => (
                <TaskItem key={item.id} task={item} />
            ))}
        </div>
    );
};

// Main component
export const Temp = () => {
    const [TO_DO, setTO_DO] = useState<TaskSummary[]>([
        {
            id: 1,
            title: "Task 1",
            event: undefined,
            tagTitle: "Important",
            tagColor: "#FF5733",
            hashtags: [],
            status: TaskStatus.TO_DO,
        },
        {
            id: 2,
            title: "Task 2",
            event: undefined,
            tagTitle: "Work",
            tagColor: "#33FF57",
            hashtags: [],
            status: TaskStatus.TO_DO,
        },
    ]);

    const [IN_PROGRESS, setIN_PROGRESS] = useState<TaskSummary[]>([
        {
            id: 3,
            title: "Task 3",
            event: undefined,
            tagTitle: "Personal",
            tagColor: "#3357FF",
            hashtags: [],
            status: TaskStatus.IN_PROGRESS,
        },
        {
            id: 4,
            title: "Task 4",
            event: undefined,
            tagTitle: "Chore",
            tagColor: "#FF33A1",
            hashtags: [],
            status: TaskStatus.IN_PROGRESS,
        },
    ]);

    // Function to move an item from one container to another
    const moveItem = (id: number, fromStatus: TaskStatus, toStatus: TaskStatus) => {
        let fromContainerItems, toContainerItems, setFromContainer, setToContainer;

        // Source와 Target Container를 구분
        if (fromStatus === TaskStatus.TO_DO) {
            fromContainerItems = TO_DO;
            setFromContainer = setTO_DO;
        } else {
            fromContainerItems = IN_PROGRESS;
            setFromContainer = setIN_PROGRESS;
        }

        if (toStatus === TaskStatus.TO_DO) {
            toContainerItems = TO_DO;
            setToContainer = setTO_DO;
        } else {
            toContainerItems = IN_PROGRESS;
            setToContainer = setIN_PROGRESS;
        }

        // Moved Item 찾기 및 상태 업데이트
        const movedItem = fromContainerItems.find((item) => item.id === id);
        if (!movedItem) return; // 항목이 없을 경우 중단

        setFromContainer(fromContainerItems.filter((item) => item.id !== id));
        setToContainer([...toContainerItems, { ...movedItem, status: toStatus }]);
    };

    return (
        <CommonLayout>
            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-2 gap-2">
                    <TaskBoard items={TO_DO} status={TaskStatus.TO_DO} moveItem={moveItem} />
                    <TaskBoard items={IN_PROGRESS} status={TaskStatus.IN_PROGRESS} moveItem={moveItem} />
                </div>
            </DndProvider>
        </CommonLayout>
    );
};
