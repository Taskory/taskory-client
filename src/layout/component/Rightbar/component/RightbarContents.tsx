import React, {useState} from "react";
import { useTagContext } from "../../../../context/data/TagContext";
import {TagItem} from "./TagItem";
import {TagInfoDropbox} from "./TagInfoDropbox";

export const RightbarContents = () => {
    const { userTags, setSelectedTagIds } = useTagContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);
    const handleAddTag = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <>
            <div className="mt-2">
                {/* 1st space */}
                <div className="flex gap-1 mb-2">
                    <button onClick={selectAllTags} className="btn btn-xs btn-primary">
                        Select All
                    </button>
                    <button onClick={clearAllTags} className="btn btn-xs btn-secondary">
                        Clear All
                    </button>
                    <div className="relative">
                        <button onClick={handleAddTag} className="btn btn-xs btn-info">
                            + Tag
                        </button>
                        {isDropdownOpen && (
                            <TagInfoDropbox
                                onClose={() => setIsDropdownOpen(false)}
                            />
                        )}
                    </div>

                </div>

                {/* 3rd space - Tag List Section */}
                <div className="flex flex-col gap-1">
                    {userTags.map((tag, index) => (
                        <TagItem
                            key={tag.id}
                            tag={tag}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
