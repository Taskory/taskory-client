import React from 'react';
import {EventInterface} from "../../../../../api/interface/EventInterface";

interface DayProps {
    day: number;
    events: EventInterface[];
}

export const Day: React.FC<DayProps> = ({ day, events }) => {
    return (
        <div className="border p-2 h-36 overflow-hidden relative">
            <div className="text-right">{day}</div>
            <div className="overflow-hidden h-full">
                {events.slice(0, 4).map((event, idx) => (
                    <div key={idx} className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-sm text-blue-500">{event.title}</span>
                        <div className="text-xs text-gray-500">{new Date(event.startDateTime).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
            {events.length > 4 && (
                <div className="absolute bottom-0 left-0 w-full text-center text-xs text-gray-500">
                    ...
                </div>
            )}
        </div>
    );
};
