import React, {useEffect, useState} from "react";
import {DayColumnProps, StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";
import {EventInterface} from "../../../../api/interface/EventInterface";
import {processEventPosition} from "../util/WeekCalendarUtils";
import {EventCell} from "./EventCell";

export const DayColumn: React.FC<DayColumnProps> = ({events}) => {
    const [styledEvents, setStyledEvents] = useState<StylesForEachEventInterface[]>([]);
    const [allDayEvents, setAllDayEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        if (events) {
            const {styledEvents, allDayEvents}: {
                styledEvents: StylesForEachEventInterface[];
                allDayEvents: EventInterface[]
            } = processEventPosition(events);
            setStyledEvents(styledEvents);
            setAllDayEvents(allDayEvents);
        }
    }, [events]);
    return (
        <div className="grid">
            <div className="h-weekCalendarCellHeight border-t border-r border-gray-200">
                {allDayEvents.map((event: EventInterface, idx: number) => {
                    const textColor: string = `text-${event.tag.color.toLowerCase()}-500`;
                    return (
                        <button key={idx}
                                className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                            <span className={`text-sm px-1 font-semibold ${textColor}`}>●{event.title}</span>
                        </button>
                    );
                })}
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
