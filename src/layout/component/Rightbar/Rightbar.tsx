// src/components/Rightbar.tsx
import React, { useState } from "react";
import { useSidebarStateContext } from "../../../context/SidebarStateContext";
import { MiniCalendar } from "./MiniCalendar";
import { RightbarBtn } from "./RightbarBtn";
import { useTagContext } from "../../../context/TagContext";
import { SaveTagRequest, TagColor, TagResponse } from "../../../api/tag/TagTypes";
import { getTagStringColor } from "../../../util/TagUtil";
import { request_createTag } from "../../../api/tag/TagApi";
import { TagSelectBox } from "../../../component/TagSelectBox";

export const Rightbar: React.FC = () => {
    const { isRightbarOpened } = useSidebarStateContext();
    const { userTags, setUserTags, selectedTagIds, setSelectedTagIds } = useTagContext();

    const [newTagTitle, setNewTagTitle] = useState("");
    const [newTagColor, setNewTagColor] = useState<TagColor>(TagColor.BLUE);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editedTagTitle, setEditedTagTitle] = useState("");

    const TagColors: TagColor[] = Object.values(TagColor) as TagColor[];

    const handleCheckboxChange = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    // SaveTag Function with Async Handling and Error Catching
    const saveTag = async () => {
        try {
            if (newTagTitle.trim()) {
                const newTag: SaveTagRequest = {
                    title: newTagTitle.trim(),
                    color: newTagColor,
                };

                const createdTag: TagResponse = await request_createTag(newTag); // Await async function

                // Properly typed functional update to avoid TS7006 error
                setUserTags((prevTags: TagResponse[]) => [...prevTags, createdTag]);

                setNewTagTitle(""); // Clear input field
                setNewTagColor(TagColor.BLUE); // Reset color selection
            }
        } catch (error) {
            console.error(error); // Centralized error handling
        }
    };

    // TODO: implement api request
    const deleteTag = (id: number) => {
        const updatedTags = userTags.filter((tag) => tag.id !== id);
        setUserTags(updatedTags);
        setSelectedTagIds(selectedTagIds.filter((tagId) => tagId !== id));
    };

    const startEditing = (index: number) => {
        setEditIndex(index);
        setEditedTagTitle(userTags[index].title);
    };

    // TODO: implement api request
    const updateTag = (index: number) => {
        const updatedTags: TagResponse[] = [...userTags];
        updatedTags[index].title = editedTagTitle.trim();
        setUserTags(updatedTags);
        setEditIndex(null);
    };

    const selectAllTags = () => setSelectedTagIds(userTags.map((tag) => tag.id));
    const clearAllTags = () => setSelectedTagIds([]);

    return (
        <div
            className={`transition-all duration-200 flex flex-col justify-between items-center bg-base-100 shadow rounded h-full p-2 ${
                isRightbarOpened ? "w-sidebarOpened" : "w-sidebarClosed"
            }`}
        >
            <div className="w-full">
                <RightbarBtn />

                {isRightbarOpened && (
                    <div className="mt-2">
                        <div className="flex gap-1 mb-2">
                            <button
                                onClick={selectAllTags}
                                className="btn btn-xs btn-primary"
                            >
                                Select All
                            </button>
                            <button
                                onClick={clearAllTags}
                                className="btn btn-xs btn-secondary"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 mb-1">
                            <input
                                type="text"
                                value={newTagTitle}
                                onChange={(e) => setNewTagTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveTag()}
                                placeholder="Add new tag"
                                className="input input-xs input-bordered w-full"
                            />
                            <TagSelectBox list={TagColors} state={newTagColor} setState={setNewTagColor} />
                            <button onClick={saveTag} className="btn btn-xs btn-accent">Add</button>
                        </div>

                        <div className="flex flex-col gap-1">
                            {userTags.map((tag, index) => (
                                <div
                                    key={tag.id}
                                    className={`flex items-center justify-between group hover:bg-gray-100 rounded ${getTagStringColor(tag.color)}`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <input
                                            type="checkbox"
                                            checked={selectedTagIds.includes(tag.id)}
                                            onChange={() => handleCheckboxChange(tag.id)}
                                            className={`checkbox checkbox-xs`}
                                        />

                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editedTagTitle}
                                                onChange={(e) => setEditedTagTitle(e.target.value)}
                                                onBlur={() => updateTag(index)}
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" && updateTag(index)
                                                }
                                                className="input input-xs input-bordered"
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                onDoubleClick={() => startEditing(index)}
                                                className="cursor-pointer w-full text-xs"
                                            >
                                                {tag.title}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => startEditing(index)}
                                            className="btn btn-xs btn-info"
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => deleteTag(tag.id)}
                                            className="btn btn-xs btn-error"
                                        >
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isRightbarOpened && (
                <div className="w-full mt-auto">
                    <MiniCalendar />
                </div>
            )}
        </div>
    );
};


