import React, { Dispatch, SetStateAction, useState } from 'react';
import { getTagBGColor } from '../util/TagUtil';
import {TagResponse} from '../api/tag/TagTypes';
import {ColorBadge} from "./ColorBadge";

interface TagSelectBoxProps {
    list: TagResponse[];
    state: TagResponse | undefined;
    setState: Dispatch<SetStateAction<TagResponse | undefined>>;
}

export const TagSelectBox: React.FC<TagSelectBoxProps> = ({list, state, setState}) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (tag: TagResponse) => {
        setState(tag);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return (
        <div className={`dropdown`}>
            <div tabIndex={0} role="button"
                 onClick={toggleDropdown}
                 className="flex items-center cursor-pointer">
                <ColorBadge color={state?.color ?? ''} />
                <div className="px-1">{state?.title ?? "none"}</div>
            </div>
            <ul tabIndex={0}
                className={`dropdown-content mb-1 bg-white rounded-b flex flex-col z-[1] ${isDropdownOpen ? '' : 'hidden'}`}>
                {list.map((option, index) => (
                    (state?.title !== option.title &&
                        (
                            <li key={option ? `TagColor-${option.toString()}-${index.toString()}` : `TagColor-${index.toString()}`}
                                className={`flex items-center gap-y-2 cursor-pointer text-center`}
                                onClick={() => handleSelect(option)}>
                                <ColorBadge color={option?.color} />
                                <div className="px-1">{option.title}</div>
                            </li>
                        ))

                ))}
            </ul>
        </div>
    );
};
