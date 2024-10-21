import React, {useState} from "react";
import {TagColor} from "../api/tag/TagTypes";
import {ColorBadge} from "./ColorBadge";

interface ColorSelectBoxProps {
    list: TagColor[];
    state: TagColor | null;
    setState: (color: TagColor) => void;
}

export const ColorSelectBox: React.FC<ColorSelectBoxProps> = ({ list, state, setState }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (color: TagColor) => {
        setState(color);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative">
            <div onClick={toggleDropdown}>
                <ColorBadge color={state} />
            </div>
            {isDropdownOpen && (
                <ul className="mb-1 rounded-box flex flex-col z-[1] shadow absolute bg-white">
                    {list.map((option, index) => (
                        <li key={`TagColor-${option}-${index}`} onClick={() => handleSelect(option)}>
                            <ColorBadge color={option} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
