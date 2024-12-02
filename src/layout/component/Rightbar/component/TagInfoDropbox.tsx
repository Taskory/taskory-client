import React, { useState, useEffect, useRef } from "react";
import {SaveTagRequest, TagColor, TagResponse} from "../../../../api/tag/TagTypes";
import { useTagContext } from "../../../../context/data/TagContext";
import {request_createTag, request_deleteTag, request_updateTag} from "../../../../api/tag/TagApi";
import { ColorSelectBox } from "../../../../component/ColorSelectBox";
import {useEventContext} from "../../../../context/data/EventContext";
import {useTaskContext} from "../../../../context/data/TaskContext";

type TagInfoDropboxProps = {
    tag?: TagResponse;
    onClose: () => void; // Close dropdown callback
};

export const TagInfoDropbox: React.FC<TagInfoDropboxProps> = ({ tag, onClose }) => {
    const {fetchOriginEvents} = useEventContext();
    const {fetchOriginTasks} = useTaskContext();
    const [editedTagTitle, setEditedTagTitle] = useState(tag?.title ?? "");
    const [selectedColor, setSelectedColor] = useState<TagColor>(tag?.color ?? TagColor.BLUE);
    const { userTags, setUserTags, selectedTagIds, setSelectedTagIds } = useTagContext();
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
        const saveTagRequest: SaveTagRequest = {
            title: editedTagTitle,
            color: selectedColor
        }
        if (tag) {
            request_updateTag(tag.id, saveTagRequest).then((res) => {
                if (res) {
                    const updatedTags = userTags.map((t) =>
                        t.id === tag.id ? {...t, title: editedTagTitle.trim(), color: selectedColor} : t
                    );
                    setUserTags(updatedTags);
                    fetchOriginEvents();
                    fetchOriginTasks();
                }
            });
        } else {
            request_createTag(saveTagRequest).then((res) => {
                if (res) {
                    setUserTags([...userTags, {id: res.id, title: editedTagTitle, color: selectedColor}]);
                    setSelectedTagIds([...selectedTagIds, res.id]);
                    fetchOriginEvents();
                    fetchOriginTasks();
                }
            });
        }
        onClose();
    };

    const deleteTag = () => {
        if (tag) {
            request_deleteTag(tag.id).then((res) => {
                if (res) {
                    const updatedTags = userTags.filter((t) => t.id !== tag.id);
                    setUserTags(updatedTags);
                    fetchOriginEvents();
                    fetchOriginTasks();
                }
            });
        }
        onClose(); // Close the dropdown after delete
    };

    const TagColors = Object.values(TagColor) as TagColor[];

    return (
        <div
            ref={dropdownRef}
            className="absolute right-1 mt-10 bg-white border rounded shadow-lg z-10 w-48 p-2"
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
                <button onClick={() => onClose()} className="btn btn-xs">
                    close
                </button>
            </div>
        </div>
    );
};
