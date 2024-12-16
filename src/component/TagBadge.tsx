import {getTagColorStyle} from "../util/TagUtil";
import React from "react";
import {TagColor} from "../api/tag/TagTypes";

export const TagBadge: React.FC< {tagColor: TagColor, tagTitle: string} > = ({tagColor, tagTitle}) => {
    return (
        <div className={`w-20 p-1 ${getTagColorStyle(tagColor)} rounded-full`} title={tagTitle ?? ""}>
            <div className="overflow-hidden truncate text-xs text-center">
                {tagTitle ?? ""}
            </div>
        </div>
    );
}
