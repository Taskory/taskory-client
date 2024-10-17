import React, { Dispatch, SetStateAction, useState } from 'react';
import { getTagBGColor } from '../util/TagUtil';
import { TagColor } from '../api/tag/TagTypes';

interface TagSelectBoxProps {
    list: TagColor[];
    state: TagColor;
    setState: Dispatch<SetStateAction<TagColor>>;
}

export const TagSelectBox: React.FC<TagSelectBoxProps> = ({list, state, setState}) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (color: TagColor) => {
        setState(color);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className={`dropdown`}>
            <div tabIndex={0} role="button"
                 onClick={toggleDropdown}
                 className={`badge cursor-pointer ${getTagBGColor(state?.toString() ?? '')}`}/>
            <ul tabIndex={0}
                className={`dropdown-content mb-1 rounded-box flex flex-col z-[1] shadow ${isDropdownOpen ? '' : 'hidden'}`}>
                {list.map((option, index) => (
                    <li key={option ? `TagColor-${option.toString()}-${index.toString()}` : `TagColor-${index.toString()}`}
                        className={`badge cursor-pointer ${getTagBGColor(option?.toString() ?? '')} text-center`}
                        onClick={() => handleSelect(option)}/>
                ))}
            </ul>
        </div>
    );
};
