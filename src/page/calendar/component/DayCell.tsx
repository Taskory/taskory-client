import React from 'react';
import { Cell } from './Cell';
import {EventSummary} from "../../../api/event/EventsTypes"; // Adjust the import path as necessary

interface DayProps {
    day: number;
    events: EventSummary[];
}

export const DayCell: React.FC<DayProps> = ({ day, events }) => {
    return (
        <Cell className={`h-full grid`}>
            <div className="text-left ml-2 mt-1 h-full row-span-1">{day}</div>
            <div className={`overflow-hidden h-full flex flex-col-reverse mb-1`}>
                    {events.map((event, idx) => {
                        const textColor = `text-${event.tagColor.toLowerCase()}-500`;
                        return (
                            <button key={idx}
                                    className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                                <span className={`text-sm px-1 font-semibold ${textColor}`}>●{event.title}</span>
                            </button>
                        );
                    })}
                </div>
        </Cell>
);
};
