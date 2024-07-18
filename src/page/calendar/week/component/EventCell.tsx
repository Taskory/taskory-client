import React from "react";
import {StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";

export const EventCell: React.FC<StylesForEachEventInterface> = ({top, bottom, left, right, color, title}) => {
    const height = `${(+bottom) - (+top)}`;
    const width = `${100 - (+left)}`;
    return (
        <div
            className={`w-full absolute p-1 text-xs text-center content-center bg-${color}-100`}
            style={{top: `${top}%`, height: `${height}%`, left: `${left}%`, width: `${width}%`}}
        >
            <div className={`h-full w-[5px] bg-${color}-300`}/>
            <div
                className="absolute left-0 top-0 h-full"
                style={{width: '4px', backgroundColor: `${color}-100`, borderLeft: `5px solid ${color}`}}
            >
                <div className="pl-4 font-semibold">{title}</div>
            </div>
        </div>
    )
}
