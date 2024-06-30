import React from 'react';
import { EventInterface } from "../../../../../api/interface/EventInterface";

interface DayProps {
    day: number;
    events: EventInterface[];
}

export const Day: React.FC<DayProps> = ({ day, events }) => {
    return (
        <div className="border h-36 overflow-hidden relative flex flex-col">
            <div className="text-left ml-2 mt-1">{day}</div>
            {/* reverse */}
            <div className="overflow-hidden h-full flex flex-col-reverse mb-1">
                {events.length > 4 && (
                <div className="bottom-0 left-0 w-full text-center text-xs text-gray-500">
                    more..
                </div>
                )}
                {events.slice(0, 4).map((event, idx) => {
                    const textColor = `text-${event.tag.color.toLowerCase()}-500`;
                    return (
                        <button key={idx}
                                className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                            <span className={`text-sm px-1 font-semibold ${textColor}`}>●{event.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
