import React from "react";
import {getTagStringColor} from "../util/TagUtil";
import {TagBadge} from "./TagBadge";
import {TaskSummary} from "../api/task/TaskTypes";
import {TagColor} from "../api/tag/TagTypes";

export const TaskOption: React.FC<{ task: TaskSummary }> = ({task}) => {
    return (
        <div className="grid grid-cols-2 items-center h-7 w-full">
            <div className={`${getTagStringColor(task.tagColor as TagColor)} flex items-center gap-2`}>
                <TagBadge tagColor={task.tagColor as TagColor} tagTitle={task.tagTitle}/>
                <p className="overflow-hidden truncate">{task.title}</p>
            </div>
        </div>
    );
}

