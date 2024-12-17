// TaskItem.tsx
import React, {useState, useCallback, SetStateAction} from 'react';
import {TaskSummary} from "../../api/task/TaskTypes";

interface TaskSummaryCardProps {
    item: TaskSummary,
    setItems: React.Dispatch<SetStateAction<TaskSummary[]>>;
}

export const TaskSummaryCard: React.FC<TaskSummaryCardProps> = React.memo(({ item, setItems }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsEditing(false);
        if (editedTitle !== item.title) {
            setItems((prevItems) =>
                prevItems.map((prevItem) =>
                    prevItem.id === item.id ? { ...prevItem, title: editedTitle } : prevItem
                )
            );
        }
    }, [editedTitle, item.id, item.title, setItems]);

    const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInputBlur();
        }
    }, [handleInputBlur]);

    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setItems((prevItems) => prevItems.filter((prevItem) => prevItem.id !== item.id));
    }, [item.id, setItems]);

    return (
        <div
            className={`flex items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer text-gray-800`}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    autoFocus
                    className="flex-1 p-1 border-b border-gray-300 focus:outline-none"
                />
            ) : (
                <p className="flex-1">{item.title}</p>
            )}
            <button
                type="button"
                className="btn btn-xs btn-primary ml-2"
                onClick={handleEditClick}
            >
                Edit
            </button>
            <button
                type="button"
                className="btn btn-xs btn-error ml-2"
                onClick={handleDeleteClick}
            >
                Delete
            </button>
        </div>
    );
});
