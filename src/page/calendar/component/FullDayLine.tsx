import React, {useEffect, useState} from "react";
import {DayColumnProps, StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";
import {EventInterface} from "../../../api/interface/EventInterface";
import {processEventPosition} from "../util/WeekCalendarUtils";
import {EventCell} from "./EventCell";
import {FullDayLineProps} from "../interface/DayCalendarInterface";

export const FullDayLine: React.FC<FullDayLineProps> = ({events}) => {
    const [styledEvents, setStyledEvents] = useState<StylesForEachEventInterface[]>([]);

    console.log("result");
    console.log(events);

    useEffect(() => {
        const styledEvents: StylesForEachEventInterface[] = processEventPosition(events);
        setStyledEvents(styledEvents);
    }, [events]);

    return (
        <div className="grid">
            <div className="h-weekCalendarCellHeight border-t border-r border-gray-200">
                <button className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className={`text-sm px-1 font-semibold`}></span>
                </button>
            </div>
            <div className="relative border-r border-gray-200 h-full">
                <div className="absolute w-full h-[1200px]">
                    {styledEvents.map((event: StylesForEachEventInterface, idx: number) => {
                        return (
                            <EventCell
                                key={idx}
                                top={event.top}
                                bottom={event.bottom}
                                title={event.title}
                                left={event.left}
                                color={event.color}
                            />
                        )
                    })}
                </div>
                {Array.from({length: 24}, (_, hour: number) => (
                    <div key={hour} className="h-weekCalendarCellHeight border-t border-gray-200"></div>
                ))}
            </div>
        </div>
    );
}
