import React from "react";
import {TaskSummary} from "../../../api/task/TaskTypes";
import { useTaskModal } from "../context/TaskModalContext";
import { useDrag } from "react-dnd";
import { ItemType } from "../../../api/task/TaskApi";
import {getTagColorStyle} from "../../../util/TagUtil";
import {getStatusStyle} from "../../../util/StatusUtil";

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


