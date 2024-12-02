import React, {useState} from "react";
import {TagColor} from "../api/tag/TagTypes";
import {ColorBadge} from "./ColorBadge";

interface ColorSelectBoxProps {
    list: TagColor[];
    state: TagColor;
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
            <div onClick={toggleDropdown} className="cursor-pointer">
                <ColorBadge color={state}/>
            </div>
            {isDropdownOpen && (
                <div
                    className="rounded-lg shadow-lg grid grid-cols-5 w-28 absolute bg-white border border-gray-200 z-10 "
                    onClick={(e) => e.stopPropagation()}
                >
                    {list.map((option, index) => (
                        <div
                            key={`TagColor-${option}-${index}`}
                            onClick={() => handleSelect(option)}
                            className="flex items-center justify-center cursor-pointer p-1 hover:bg-gray-100 transition-all"
                        >
                            <ColorBadge color={option}/>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};
