import { getTagColorClass } from "../../util/TagUtil";
import React, { ChangeEvent } from "react";
import { useTagContext } from "../../context/TagContext";

interface TagSelectBoxProps {
    selectedTagId: number | undefined;
    onChange: (value: number | undefined) => void; // Flexible function type for onChange
}

export const TagSelectBox: React.FC<TagSelectBoxProps> = ({ selectedTagId, onChange }) => {
    const { tags } = useTagContext();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const tagId = e.target.value ? Number(e.target.value) : undefined;
        onChange(tagId); // Pass the selected tag ID to onChange
    };

    return (
        <div className="flex items-center">
            <p className={getTagColorClass(tags.find(tag => tag.id === selectedTagId)?.color || '')}>●</p>
            <select
                className="select select-sm w-full ml-1"
                value={selectedTagId ?? ''}
                onChange={handleChange}
            >
                <option value="">none</option>
                {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                        {tag.title} ({tag.color})
                    </option>
                ))}
            </select>
        </div>
    );
};
