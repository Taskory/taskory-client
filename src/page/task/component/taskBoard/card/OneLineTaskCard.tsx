import React from "react";
import { useTaskModal } from "../../../../../modal/context/TaskModalContext";
import { CardType } from "../../../../../api/task/TaskTypes";
import { useTaskDragDrop } from "../../../context/TaskDragDropContext";
import { calculateProgressRate } from "../../../../../util/TaskUtil";
import {TagBadge} from "../../../../../component/TagBadge";
import {TagColor} from "../../../../../api/tag/TagTypes";
import {StatusBadge} from "../../../../../component/StatusBadge";


export const OneLineTaskCard: React.FC<CardType> = ({ task }) => {
    const { openTaskModal } = useTaskModal();
    const { useTaskDrag } = useTaskDragDrop();

    const [, drag] = useTaskDrag(task);

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openTaskModal(task.id);
    };

    const progressRate = calculateProgressRate(task);

    return (
        <div className="relative w-full h-full">
            <div
                className="bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:border-gray-400 transition-shadow duration-200 cursor-pointer flex items-center gap-4 w-full h-full"
                aria-label={`Task card for ${task.title}`}
            >
                {/* Task Title */}
                <h3
                    className="text-gray-900 font-bold text-sm truncate flex-1"
                    title={task.title}
                >
                    {task.title}
                </h3>

                {/* Event Title */}
                <p className="text-gray-600 text-xs truncate flex-none w-1/4">
                    {task.event ? task.event.title : "No event"}
                </p>
                {/* Hashtags */}
                <div className="flex flex-wrap gap-1">
                    {task.hashtags.length > 0 ? (
                        task.hashtags.map((hashtag) => (
                            <span key={hashtag.id}
                                  className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">
                            #{hashtag.title}
                        </span>
                        ))
                    ) : (
                        <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">
                        No Hashtags
                    </span>
                    )}
                </div>
                {/* Tag */}
                <TagBadge tagColor={task.tagColor as TagColor} tagTitle={task.tagTitle}/>

                {/* Status */}
                <StatusBadge status={task.status} />

                {/* Progress */}
                <div className="flex items-center gap-2 flex-none">
                    <progress
                        className="progress progress-primary w-16"
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
            <button ref={drag} className={`absolute top-0 left-0 w-full h-full opacity-0`}
                    onClick={handleCardClick}/>
        </div>
    );
};