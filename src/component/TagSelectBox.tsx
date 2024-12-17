import React, { Dispatch, SetStateAction, useState } from "react";
import { TagResponse } from "../api/tag/TagTypes";
import { ColorBadge } from "./ColorBadge";

interface TagSelectBoxProps {
  list: TagResponse[];
  tagState: TagResponse;
  setTagState: Dispatch<SetStateAction<TagResponse>>;
}

export const TagSelectBox: React.FC<TagSelectBoxProps> = ({
                                                            list,
                                                            tagState,
                                                            setTagState,
                                                          }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (tag: TagResponse) => {
    setTagState(tag);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Trigger */}
      <div
        tabIndex={0}
        role="button"
        onClick={toggleDropdown}
        className="flex items-center gap-1 rounded px-2 py-1 cursor-pointer hover:bg-gray-200 transition duration-200"
      >
        <ColorBadge color={tagState?.color ?? ""} />
        <div className="truncate text-sm">{tagState?.title ?? "none"}</div>
      </div>

      {/* Dropdown List */}
      <ul
        className={`absolute z-10 bg-white shadow-md rounded transition-all duration-300 overflow-hidden ${
          isDropdownOpen ? "max-h-60" : "max-h-0"
        } w-full`}
      >
        {list.map((option, index) => (
          <li
            key={`TagColor-${index}`}
            className="flex items-center px-2 py-1 gap-1 text-sm cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition duration-200"
            onClick={() => handleSelect(option)}
          >
            <ColorBadge color={option?.color} />
            <div className="truncate">{option.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
