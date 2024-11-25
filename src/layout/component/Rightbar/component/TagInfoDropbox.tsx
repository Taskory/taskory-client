import React, { useState, useEffect, useRef } from "react";
import { TagColor, TagResponse } from "../../../../api/tag/TagTypes";
import { useTagContext } from "../../../../context/TagContext";
import { request_deleteTag } from "../../../../api/tag/TagApi";
import { ColorSelectBox } from "../../../../component/ColorSelectBox";

type TagInfoDropboxProps = {
    tag: TagResponse;
    onClose: () => void; // Close dropdown callback
};

export const TagInfoDropbox: React.FC<TagInfoDropboxProps> = ({ tag, onClose }) => {
    const [editedTagTitle, setEditedTagTitle] = useState(tag.title);
    const [selectedColor, setSelectedColor] = useState<TagColor | null>(tag.color);
    const { userTags, setUserTags } = useTagContext();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const updateTag = () => {
        const updatedTags = userTags.map((t) =>
            t.id === tag.id ? { ...t, title: editedTagTitle.trim(), color: selectedColor } : t
        );
        setUserTags(updatedTags);
        onClose();
    };

    const deleteTag = () => {
        request_deleteTag(tag.id).then((res) => {
            if (res) {
                const updatedTags = userTags.filter((t) => t.id !== tag.id);
                setUserTags(updatedTags);
            }
        });
        onClose(); // Close the dropdown after delete
    };

    const TagColors = Object.values(TagColor) as TagColor[];

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-48 p-2"
        >
            <div className="flex items-center gap-2 mb-2">
                {/* Color Selection */}
                <ColorSelectBox
                    list={TagColors}
                    state={selectedColor}
                    setState={setSelectedColor}
                />

                {/* Title Input */}
                <input
                    type="text"
                    value={editedTagTitle}
                    onChange={(e) => setEditedTagTitle(e.target.value)}
                    className="input input-xs flex-1 input-bordered"
                    placeholder="Title"
                />
            </div>
            <div className="flex justify-between mt-2">
                <button onClick={updateTag} className="btn btn-xs btn-success">
                    Save
                </button>
                <button onClick={deleteTag} className="btn btn-xs btn-error">
                    Delete
                </button>
            </div>
        </div>
    );
};
