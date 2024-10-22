import {TagResponse} from "../../../../api/tag/TagTypes";
import React, {useState} from "react";
import {getTagCheckBoxColor} from "../../../../util/TagUtil";
import {useTagContext} from "../../../../context/TagContext";

type TagItemProps = {
    tag: TagResponse;
    index: number;
};

export const TagItem: React.FC<TagItemProps> = ({ tag, index }) => {
    const [editedTagTitle, setEditedTagTitle] = useState("");
    const { userTags, setUserTags, selectedTagIds, setSelectedTagIds } = useTagContext();
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleCheckboxChange = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
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

                {editIndex === index ? (
                    <input
                        type="text"
                        value={editedTagTitle}
                        onChange={(e) => setEditedTagTitle(e.target.value)}
                        onBlur={() => updateTag(index)}
                        onKeyDown={(e) => e.key === "Enter" && updateTag(index)}
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
                <button onClick={() => startEditing(index)} className="btn btn-xs btn-info">
                    edit
                </button>
                <button onClick={() => deleteTag(tag.id)} className="btn btn-xs btn-error">
                    delete
                </button>
            </div>
        </div>
    );
};
