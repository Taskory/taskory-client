import React from "react";
import { useTaskModal } from "../../../../../context/modal/TaskModalContext";
import { getTagColorStyle } from "../../../../../util/TagUtil";
import { getStatusStyle } from "../../../../../util/StatusUtil";
import { CardType } from "../../../../../api/task/TaskTypes";
import { useTaskDragDrop } from "../../../context/TaskDragDropContext";
import {calculateProgressRate} from "../../../../../util/TaskUtil";

export const OneLineTaskCard: React.FC<CardType> = ({ task }) => {
    const { openTaskModal } = useTaskModal();
    const { useTaskDrag } = useTaskDragDrop();

    const [, drag] = useTaskDrag(task);

    // 모달이 열릴 때 클릭 중복 방지
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openTaskModal(task.id);
    };

    const progressRate = calculateProgressRate(task);

    return (
        <div
            className="bg-white p-2 rounded-lg shadow border border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-2"
            onClick={handleCardClick}
            ref={drag}
            aria-label={`Task card for ${task.title}`} // 접근성 향상
        >
            <p
                className="text-gray-900 font-medium truncate text-sm flex-1"
                title={task.title}
            >
                {task.title}
            </p>
            <div
                className={`rounded-full px-2 py-0.5 text-xs font-semibold truncate w-20 ${getTagColorStyle(
                    task.tagColor ?? ""
                )}`}
                title={task.tagTitle ?? ""}
            >
                {task.tagTitle ?? ""}
            </div>
            {task.event?.title && (
                <p
                    className="text-gray-600 text-xs truncate flex-1"
                    title={task.event?.title}
                >
                    {task.event?.title}
                </p>
            )}
            <div
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusStyle(task.status)}`}
                aria-label={`Status: ${task.status}`} // 접근성 향상
            >
                {task.status}
            </div>
            <div className="flex-1 flex items-center gap-2">
                 {/*Progress Bar*/}
                <progress
                    className="progress progress-primary w-full"
                    value={progressRate}
                    max={100}
                    aria-label={`Task progress: ${progressRate}%`}
                ></progress>
                <span
                    className="text-gray-900 font-bold text-xs"
                    aria-label={`Task progress: ${progressRate}%`}
                >
                    {progressRate}%
                </span>
            </div>
        </div>
    );
};
