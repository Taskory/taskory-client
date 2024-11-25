import React from "react";
import { useTagContext } from "../../../../context/data/TagContext";
import { TagInputSection } from "./TagInputSection";
import {TagItem} from "./TagItem";

export const RightbarContents = () => {
    const { userTags, setSelectedTagIds } = useTagContext();

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);

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
                </div>

                {/* 2nd space - Tag Input Section */}
                <TagInputSection/>

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
