import React, {SetStateAction, useCallback, useState} from "react";
import {TaskStatus} from "../../api/task/TaskTypes";
import {SavedTaskCard} from "./SavedTaskCard";
import {TaskInEventDto} from "../../api/event/EventsTypes";

interface TaskListProps {
    items: TaskInEventDto[],
    setItems: React.Dispatch<SetStateAction<TaskInEventDto[]>>;
}

export const TaskSection: React.FC<TaskListProps> = ({items, setItems}) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');

    const handleAddTaskItem = useCallback(() => {
        if (newTaskTitle.trim() !== '') {
            const newTaskItem: TaskInEventDto = {
                id: Date.now() * (-1),  // Temporary ID
                title: newTaskTitle,
                status: TaskStatus.BACKLOG
            };
            setItems([...items, newTaskItem]);
            setNewTaskTitle('');
        }
    }, [items, newTaskTitle, setItems]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskItem();
        } else if (e.key === 'Escape') {
            e.currentTarget.blur(); // Removes focus from the input
        }
    }, [handleAddTaskItem]);

    return (
        <>
            <label className="col-span-1 text-sm text-right mt-2 mr-1">Checklist</label>
            <div className="col-span-3 flex items-center gap-2">
                <input
                    type="text"
                    className="input input-bordered input-sm flex-1 focus:outline-none focus:border-blue-500"
                    placeholder="New checklist item"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button type="button" className="btn btn-primary btn-sm"
                        onClick={handleAddTaskItem}>
                    Add
                </button>
            </div>
            <ul className="col-span-4 space-y-2 h-52 overflow-y-auto mt-2">
                {items.map((item, index) => (
                    <SavedTaskCard key={index} item={item} setItems={setItems}/>
                ))}
            </ul>
        </>
    );
};
