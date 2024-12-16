import React, { Dispatch, SetStateAction, useState } from 'react';
import {TagResponse} from '../api/tag/TagTypes';
import {ColorBadge} from "./ColorBadge";

interface TagSelectBoxProps {
    list: TagResponse[];
    tagState: TagResponse;
    setTagState: Dispatch<SetStateAction<TagResponse>>;
}

export const TagSelectBox: React.FC<TagSelectBoxProps> = ({list, tagState, setTagState}) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (tag: TagResponse) => {
        setTagState(tag);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className={`dropdown w-full`}>
            <div tabIndex={0} role="button"
                 onClick={toggleDropdown}
                 className="flex items-center cursor-pointer">
                <ColorBadge color={tagState?.color ?? ''}/>
                <div className="px-1 truncate w-full">{tagState?.title ?? "none"}</div>
            </div>
            <ul tabIndex={0}
                className={`dropdown-content mb-1 bg-white rounded-b flex flex-col z-[1] ${isDropdownOpen ? '' : 'hidden'} w-full`}>
                {list.map((option, index) => (
                    (
                        <li key={option ? `TagColor-${option.toString()}-${index.toString()}` : `TagColor-${index.toString()}`}
                            className={`flex items-center gap-y-2 cursor-pointer text-center`}
                            onClick={() => handleSelect(option)}>
                            <ColorBadge color={option?.color}/>
                            <div className="px-1 truncate">{option.title}</div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
