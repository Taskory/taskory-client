import React from "react";
import {TaskStatus, TaskSummary} from "../../../api/task/TaskTypes";
import { useTaskModal } from "../context/TaskModalContext";
import { useDrag } from "react-dnd";
import { ItemType } from "../../../api/task/TaskApi";
import {TagColor} from "../../../api/tag/TagTypes";

interface TaskItemProps {
    task: TaskSummary;
}

export const TaskCard: React.FC<TaskItemProps> = ({ task }) => {
    const { openTaskModal } = useTaskModal();

    const [, drag] = useDrag(() => ({
        type: ItemType,
        item: () => {
            return task;
        }
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
             onClick={() => openTaskModal(task.id)}
             ref={drag}>
            <div className="flex justify-between items-center mb-2">
                <p className="text-gray-900 font-bold text-lg truncate">{task.title}</p>
                {task.tagTitle && (
                    <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getTagColorStyle(task.tagColor)}`}>
                        {task.tagTitle}

                    </span>
                )}
            </div>
            {task.event && (
                <p className="text-sm text-gray-600 mb-2 truncate">Event: {task.event.title}</p>
            )}
            {task.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {task.hashtags.map((hashtag) => (
                        <span key={hashtag.id} className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs">
                            #{hashtag.title}
                        </span>
                    ))}
                </div>
            )}
            <div className="mt-3">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(task.status)}`}>
                    {task.status}
                </span>
            </div>
        </div>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case TaskStatus.DONE:
            return 'bg-green-100 text-green-800';
        case TaskStatus.IN_PROGRESS:
            return 'bg-yellow-100 text-yellow-800';
        case TaskStatus.TO_DO:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getTagColorStyle = (tagColor: string) => {
    switch (tagColor) {
        case TagColor.BLACK:
            return 'bg-black text-white';
        case TagColor.RED:
            return 'bg-red-100 text-red-800';
        case TagColor.GREEN:
            return 'bg-green-100 text-green-800';
        case TagColor.BLUE:
            return 'bg-blue-100 text-blue-800';
        case TagColor.YELLOW:
            return 'bg-yellow-100 text-yellow-800';
        case TagColor.ORANGE:
            return 'bg-orange-100 text-orange-800';
        case TagColor.PURPLE:
            return 'bg-purple-100 text-purple-800';
        case TagColor.BROWN:
            return 'bg-yellow-900 text-yellow-100';
        case TagColor.PINK:
            return 'bg-pink-100 text-pink-800';
        case TagColor.CYAN:
            return 'bg-cyan-100 text-cyan-800';
        case TagColor.LINE:
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};