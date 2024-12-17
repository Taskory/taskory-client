import {TaskItemCard} from "../../page/task/component/TaskItemCard";
import React, {SetStateAction, useCallback, useMemo, useState} from "react";
import {TaskItemDto} from "../../api/task/TaskTypes";
import {useTaskModal} from "../context/TaskModalContext";

interface TaskItemListProps {
    items: TaskItemDto[],
    setItems: React.Dispatch<SetStateAction<TaskItemDto[]>>;
}

export const TaskItemSection: React.FC<TaskItemListProps> = ({items, setItems}) => {
    const { selectedTaskId } = useTaskModal();
    const [newTaskItemTitle, setNewTaskItemTitle] = useState<string>('');

    const handleAddTaskItem = useCallback(() => {
        if (newTaskItemTitle.trim() !== '') {
            const newTaskItem: TaskItemDto = {
                id: Date.now() * (-1),  // Temporary ID
                taskId: selectedTaskId ?? null,
                title: newTaskItemTitle,
                completed: false,
            };
            setItems([...items, newTaskItem]);
            setNewTaskItemTitle('');
        }
    }, [items, newTaskItemTitle, selectedTaskId, setItems]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskItem();
        }
    }, [handleAddTaskItem]);

    /* Progress Calculation */
    const calculateProgress = useMemo((): number => {
        if (items.length === 0) return 0;
        const completedItems = items.filter(item => item.completed).length;
        return Math.round((completedItems / items.length) * 100);
    }, [items]);

    return (
        <>
            <label className="col-span-1 text-sm text-right mt-2 mr-1">Checklist</label>
            <div className="col-span-3 flex items-center gap-2">
                <input
                    type="text"
                    className="input input-bordered input-sm flex-1 focus:outline-none focus:border-blue-500"
                    placeholder="New checklist item"
                    value={newTaskItemTitle}
                    onChange={(e) => setNewTaskItemTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button type="button" className="btn btn-primary btn-sm"
                        onClick={handleAddTaskItem}>
                    Add
                </button>
            </div>
            <div className="col-span-4 mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-600 h-4 rounded-full text-xs font-medium text-center text-white"
                        style={{width: `${calculateProgress}%`}}
                    >
                        {calculateProgress}%
                    </div>
                </div>
            </div>
            <ul className="col-span-4 space-y-2 h-52 overflow-y-auto mt-2">
                {items.map((item, index) => (
                    <TaskItemCard
                        key={index}
                        item={item}
                        setItems={setItems}
                    />
                ))}
            </ul>
        </>
    );
};
