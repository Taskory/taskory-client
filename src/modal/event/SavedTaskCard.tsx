import React, {useState, useCallback, SetStateAction, useEffect} from "react";
import { TaskInEventDto } from "../../api/event/EventsTypes";
import {TaskStatus} from "../../api/task/TaskTypes";
import {StatusSelectBox} from "./StatusSelectBox";

interface SavedTaskCardProps {
    item: TaskInEventDto;
    setItems: React.Dispatch<SetStateAction<TaskInEventDto[]>>;
}

export const SavedTaskCard: React.FC<SavedTaskCardProps> = React.memo(
  ({ item, setItems }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedTitle, setEditedTitle] = useState(item.title);
      const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
        item.status as TaskStatus
      );

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

      const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleInputBlur();
            }
        },
        [handleInputBlur]
      );

      const handleDeleteClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setItems((prevItems) => prevItems.filter((prevItem) => prevItem.id !== item.id));
        },
        [item.id, setItems]
      );

      useEffect(() => {
          setItems((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === item.id ? { ...prevItem, status: selectedStatus } : prevItem
            )
          );
      }, [item.id, selectedStatus, setItems]);

      return (
        <div className="flex items-center gap-2 p-2 border rounded bg-white shadow-sm text-sm hover:shadow transition-all">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                className="flex-1 input input-sm input-bordered"
              />
            ) : (
              <span className="flex-1 truncate">{item.title}</span>
            )}

            <StatusSelectBox status={selectedStatus} setStatus={setSelectedStatus} />

            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary px-2"
              onClick={handleEditClick}
            >
                edit
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-error px-2"
              onClick={handleDeleteClick}
            >
                delete
            </button>
        </div>
      );
  }
);
