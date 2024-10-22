import {SaveTagRequest, TagColor, TagResponse} from "../../../../api/tag/TagTypes";
import React, {useState} from "react";
import {ColorSelectBox} from "../../../../component/ColorSelectBox";
import {request_createTag} from "../../../../api/tag/TagApi";
import {useTagContext} from "../../../../context/TagContext";

export const TagInputSection: React.FC = () => {
    const { setUserTags} = useTagContext();
    const [newTagInfo, setNewTagInfo] = useState<SaveTagRequest>({
        title: '',
        color: TagColor.NONE,
    });

    // SaveTag Function with Async Handling and Error Catching
    const saveTag = async (newTagInfo: SaveTagRequest) => {
        try {
            if (newTagInfo.title.length > 0) {
                const createdTag: TagResponse = await request_createTag(newTagInfo); // Await async function
                setUserTags((prevTags: TagResponse[]) => [...prevTags, createdTag]);
                resetNewTagInputBox();
            }
        } catch (error) {
            console.error(error); // Centralized error handling
        }
    };

    const resetNewTagInputBox = () => {
        setNewTagInfo({
            'title': '',
            'color': TagColor.NONE,
        })
    }

    const TagColors = Object.values(TagColor) as TagColor[];

    return (
        <div className="flex gap-1 mb-1">
            <input
                type="text"
                value={newTagInfo.title}
                onChange={(e) => setNewTagInfo({ ...newTagInfo, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && saveTag(newTagInfo)}
                placeholder="Add new tag"
                className="input input-xs input-bordered w-full"
            />
            <ColorSelectBox
                list={TagColors}
                state={newTagInfo.color}
                setState={(color) => setNewTagInfo({ ...newTagInfo, color })}
            />
            <button onClick={() => saveTag(newTagInfo)} className="btn btn-xs btn-accent">
                Add
            </button>
        </div>
    );
};
