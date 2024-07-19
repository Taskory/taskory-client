import React from "react";
import {StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";

export const EventCell: React.FC<StylesForEachEventInterface> = ({top, bottom, left, color, title}) => {
    const height = `${(+bottom) - (+top)}`;
    const width = `${100 - (+left)}`;
    return (
        <div
            className={`absolute bg-${color}-100 flex flex-grow`}
            style={{top: `${top}%`, height: `${height}%`, left: `${left}%`, width: `${width}%`}}
        >
            <div className={`min-w-[3px] max-w-[5px] bg-${color}-400`}/>
            <div className="p-2 text-xs font-semibold">{title}</div>
        </div>
    );
}
