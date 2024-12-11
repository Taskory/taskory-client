import React, { useState } from "react";
import { TagResponse } from "../../../../api/tag/TagTypes";
import { getTagCheckBoxColor } from "../../../../util/TagUtil";
import { useTagContext } from "../../../../context/data/TagContext";
import { TagInfoBox } from "./TagInfoBox"; // Import the dropdown component

type TagItemProps = {
    tag: TagResponse;
};

export const TagItem: React.FC<TagItemProps> = ({ tag }) => {
    const { selectedTagIds, setSelectedTagIds } = useTagContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCheckboxChange = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    return (
        <div
            key={tag.id}
            className={`flex items-center justify-between group hover:bg-gray-100 rounded`}
        >
            <div className="flex items-center gap-2 w-full">
                <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleCheckboxChange(tag.id)}
                    className={`checkbox checkbox-xs ${getTagCheckBoxColor(tag.color)}`}
                />

                <span className="cursor-pointer w-28 text-xs truncate">
                    {tag.title}
                </span>
            </div>

            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn btn-xs btn-info"
            >
                info
            </button>

            {isDropdownOpen && (
                <TagInfoBox
                    tag={tag}
                    onClose={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};
