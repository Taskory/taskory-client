import {ColorSelectBox} from "../../../component/ColorSelectBox";
import {getTagBGColor, getTagStringColor} from "../../../util/TagUtil";
import React, {useState} from "react";
import {useTagContext} from "../../../context/TagContext";
import {SaveTagRequest, TagColor, TagResponse} from "../../../api/tag/TagTypes";
import {request_createTag} from "../../../api/tag/TagApi";
import {ColorBadge} from "../../../component/ColorBadge";

export const RightbarContents = () => {
    const { userTags, setUserTags, selectedTagIds, setSelectedTagIds } = useTagContext();
    const [newTagInfo, setNewTagInfo] = useState<SaveTagRequest>({
        title: '',
        color: TagColor.NONE,
    });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editedTagTitle, setEditedTagTitle] = useState("");

    const TagColors: TagColor[] = Object.values(TagColor) as TagColor[];

    const handleCheckboxChange = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    // SaveTag Function with Async Handling and Error Catching
    // TODO: implement api request
    const saveTag = async (newTagInfo: SaveTagRequest) => {
        try {
            if (newTagInfo.title.length > 0) {
                const createdTag: TagResponse = await request_createTag(newTagInfo); // Await async function

                // Properly typed functional update to avoid TS7006 error
                setUserTags((prevTags: TagResponse[]) => [...prevTags, createdTag]);
                resetNewTagInputBox();
            }
        } catch (error) {
            console.error(error); // Centralized error handling
        }
    };

    // after saving a tag
    const resetNewTagInputBox = () => {
        setNewTagInfo({
            'title': '',
            'color': TagColor.NONE,
        })
    }

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
        <>
            <div className="mt-2">
                {/* 1st space */}
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

                {/* 2nd space */}
                <div className="flex gap-1 mb-1">
                    <input
                        type="text"
                        value={newTagInfo.title}
                        onChange={(e) => setNewTagInfo({...newTagInfo, title: e.target.value})}
                        onKeyDown={(e) => e.key === "Enter" && saveTag(newTagInfo)}
                        placeholder="Add new tag"
                        className="input input-xs input-bordered w-full"
                    />
                    <ColorSelectBox
                        list={TagColors}
                        state={newTagInfo.color}
                        setState={(color) => setNewTagInfo({...newTagInfo, color})}
                    />

                    <button onClick={() => saveTag(newTagInfo)} className="btn btn-xs btn-accent">Add</button>
                </div>

                {/* 3rd space */}
                <div className="flex flex-col gap-1">
                    {userTags.map((tag, index) => (
                        <div
                            key={tag.id}
                            className={`flex items-center justify-between group hover:bg-gray-100 rounded`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="checkbox"
                                    checked={selectedTagIds.includes(tag.id)}
                                    onChange={() => handleCheckboxChange(tag.id)}
                                    className={`checkbox checkbox-xs ${getTagBGColor(tag.color)}`}
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
                                    <span onDoubleClick={() => startEditing(index)}
                                          className="cursor-pointer w-full text-xs">
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
        </>
    );
};