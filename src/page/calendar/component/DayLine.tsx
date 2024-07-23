import React, {useEffect, useState} from "react";
import {DayColumnProps, StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";
import {EventInterface} from "../../../api/interface/EventInterface";
import {processEventPosition} from "../util/WeekCalendarUtils";
import {EventCell} from "./EventCell";

export const DayLine: React.FC<DayColumnProps> = ({under24hoursEvents, over24hoursEvents}) => {
    const [styledEvents, setStyledEvents] = useState<StylesForEachEventInterface[]>([]);
    const [multiDayEvents, setMultiDayEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        if (under24hoursEvents) {
            const {styledEvents, allDayEvents}: {
                styledEvents: StylesForEachEventInterface[];
                allDayEvents: EventInterface[]
            } = processEventPosition(under24hoursEvents);
            setStyledEvents(styledEvents);
        }
    }, [under24hoursEvents]);

    useEffect(() => {
        setMultiDayEvents(over24hoursEvents);
    }, [over24hoursEvents]);


    return (
        <div className="grid">
            <div className="h-weekCalendarCellHeight border-t border-r border-gray-200">
                {multiDayEvents.map((event: EventInterface, idx: number) => {
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
