// TaskItem.tsx
import React, { useState } from 'react';
import { TaskItemResponse } from '../../../api/task/TaskTypes';

interface TaskItemProps {
    item: TaskItemResponse;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: (newTitle: string) => void;
}

export const TaskItemCard: React.FC<TaskItemProps> = React.memo(({ item, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
        if (editedTitle !== item.title) {
            onEdit(editedTitle);
        }
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInputBlur();
        }
    };

    return (
        <li
            className={`flex items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
            onClick={onToggle}
        >
            <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                className="mr-3 accent-blue-500"
            />
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleInputKeyPress}
                    autoFocus
                    className="flex-1 p-1 border-b border-gray-300 focus:outline-none"
                />
            ) : (
                <span className="flex-1" onClick={(e) => e.stopPropagation()}>{item.title}</span>
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
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                Delete
            </button>
        </li>
    );
});
