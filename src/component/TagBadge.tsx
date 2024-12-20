import { getTagColorStyle } from "../util/TagUtil";
import React from "react";
import { TagColor } from "../api/tag/TagTypes";

export const TagBadge: React.FC<{ tagColor: TagColor; tagTitle: string }> = ({
                                                                               tagColor,
                                                                               tagTitle,
                                                                             }) => {
  return (
    <div
      className={`inline-flex items-center px-1.5 py-0.5 ${getTagColorStyle(
        tagColor
      )} rounded-full text-xs font-medium`}
      title={tagTitle ?? ""}
    >
      <span className="truncate">{tagTitle ?? ""}</span>
    </div>
  );
};
