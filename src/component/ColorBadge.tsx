import {getTagBGColor} from "../util/TagUtil";
import React from "react";
import {TagColor} from "../api/tag/TagTypes";

interface ColorBadgeProps {
    color: TagColor | string | null;
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({color}) => {
    return (
        <>
            <button
                type="button"
                className={`badge cursor-pointer ${getTagBGColor(color ? color.toString() : '')}`}/>
        </>
    );
};