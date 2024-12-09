import React from "react";
import { useTaskModal } from "../../../../../context/modal/TaskModalContext";
import { getTagColorStyle } from "../../../../../util/TagUtil";
import { getStatusStyle } from "../../../../../util/StatusUtil";
import { CardType } from "../../../../../api/task/TaskTypes";
import { useTaskDragDrop } from "../../../context/TaskDragDropContext";
import { calculateProgressRate } from "../../../../../util/TaskUtil";

export const MultiLineTaskCard: React.FC<CardType> = ({ task }) => {
    const { openTaskModal } = useTaskModal();
    const { useTaskDrag } = useTaskDragDrop();
    const [, drag] = useTaskDrag(task);

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openTaskModal(task.id);
    };

    const progressRate = calculateProgressRate(task);

    return (
        <div
            className="bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:border-gray-400 transition-shadow duration-200 cursor-pointer"
            onClick={handleCardClick}
            ref={drag}
            aria-label={`Task card for ${task.title}`}
        >
            {/* 첫 줄 */}
            <div className="flex justify-between items-center mb-1">
                <h3
                    className="text-gray-900 font-bold text-sm truncate"
                    title={task.title}
                >
                    {task.title}
                </h3>
                <div className="flex items-center gap-1">
                    <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium truncate ${getTagColorStyle(task.tagColor ?? "")}`}
                        title={task.tagTitle ?? ""}
                    >
                        {task.tagTitle ?? "No Tag"}
                    </span>
                    <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(task.status)}`}
                        aria-label={`Status: ${task.status}`}
                    >
                        {task.status}
                    </span>
                </div>
            </div>

            {/* 두 번째 줄 */}
            <div className="flex justify-between items-center">
                <div className="flex-1 flex flex-wrap gap-1 items-center">
                    <p className="text-gray-600 text-xs truncate" title={task.event?.title ?? "No Event"}>
                        {task.event ? task.event.title : "No Event"}
                    </p>
                    {task.hashtags.length > 0 ? (
                        task.hashtags.map((hashtag) => (
                            <span
                                key={hashtag.id}
                                className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs"
                            >
                                #{hashtag.title}
                            </span>
                        ))
                    ) : (
                        <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">
                            No Hashtags
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {task.itemsCount > 0 && (
                        <span
                            className="text-gray-500 text-xs"
                            aria-label={`Completed items: ${task.completedItemsCount}/${task.itemsCount}`}
                        >
                            ({task.completedItemsCount}/{task.itemsCount})
                        </span>
                    )}
                    <progress
                        className="progress progress-primary w-20"
                        value={progressRate}
                        max={100}
                        aria-label={`Task progress: ${progressRate}%`}
                    ></progress>
                    <span
                        className="text-gray-700 font-bold text-xs"
                        aria-label={`Task progress: ${progressRate}%`}
                    >
                        {progressRate}%
                    </span>
                </div>
            </div>
        </div>
    );
};
