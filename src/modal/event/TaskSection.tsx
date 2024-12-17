import React, {SetStateAction, useCallback, useState} from "react";
import {TaskStatus, TaskSummary} from "../../api/task/TaskTypes";
import {EventSummary} from "../../api/event/EventsTypes";
import {TaskSummaryCard} from "./TaskSummaryCard";

interface TaskListProps {
    items: TaskSummary[],
    setItems: React.Dispatch<SetStateAction<TaskSummary[]>>;
    event: EventSummary;
}

export const TaskSection: React.FC<TaskListProps> = ({items, setItems, event}) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');

    const handleAddTaskItem = useCallback(() => {
        if (newTaskTitle.trim() !== '') {
            const newTaskItem: TaskSummary = {
                id: Date.now() * (-1),  // Temporary ID
                title: newTaskTitle,
                event: event,
                tagTitle: event.tag.title,
                tagColor: event.tag.color,
                hashtags: [],
                status: TaskStatus.BACKLOG,
                itemsCount: 0,
                completedItemsCount: 0,
            };
            setItems([...items, newTaskItem]);
            setNewTaskTitle('');
        }
    }, [event, items, newTaskTitle, setItems]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskItem();
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
                    <TaskSummaryCard key={index} item={item} setItems={setItems}/>
                ))}
            </ul>
        </>
    );
};
