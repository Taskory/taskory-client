import React from "react";
import { useTaskModal } from "../../../../../context/modal/TaskModalContext";
import { getTagColorStyle } from "../../../../../util/TagUtil";
import { getStatusStyle } from "../../../../../util/StatusUtil";
import {CardType} from "../../../../../api/task/TaskTypes";
import {useTaskDragDrop} from "../../../context/TaskDragDropContext";


export const DoneCard: React.FC<CardType> = ({ task }) => {
    const { openTaskModal } = useTaskModal();
    const {useTaskDrag} = useTaskDragDrop();

    const [, drag] = useTaskDrag(task);


    // 모달이 열릴 때 클릭 중복 방지
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openTaskModal(task.id);
    };

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleCardClick}
            ref={drag}
            aria-label={`Task card for ${task.title}`} // 접근성 향상
        >
            <div className="flex justify-between items-center mb-2">
                <p className="text-gray-900 font-bold text-lg truncate" title={task.title}>
                    {task.title}
                </p>
                <div
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold truncate w-24 ${getTagColorStyle(task.tagColor ?? "")}`}
                    title={task.tagTitle ?? ""}
                >
                    {task.tagTitle ?? ""}
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 truncate" title={task.event?.title}>
                <span className="font-semibold">Event:</span> {task.event?.title}
            </p>
            {task.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {task.hashtags.map((hashtag) => (
                        <div key={hashtag.id} className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs">
                            #{hashtag.title}
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-3 flex justify-between items-center">
                <div
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(task.status)}`}
                    aria-label={`Status: ${task.status}`} // 접근성 향상
                >
                    {task.status}
                </div>
                <div
                    className="radial-progress text-primary text-xs"
                    style={{
                        "--value": task.progressRate,
                        "--size": "3rem", // Set a smaller size for the progress bar
                        "--thickness": "0.3rem", // Adjust the thickness for a sleeker look
                    } as React.CSSProperties}
                    role="progressbar"
                    aria-valuenow={task.progressRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Task progress: ${task.progressRate}%`} // 접근성 향상
                >
                    <span className="text-gray-900 font-bold" style={{ fontSize: "0.75rem" }}>
                        {task.progressRate}%
                    </span>
                </div>
            </div>
        </div>
    );
};
