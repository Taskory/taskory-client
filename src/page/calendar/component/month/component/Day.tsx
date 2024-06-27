import React from "react";

interface Event {
    date: string;
    name: string;
    time: string;
}

interface DayProps {
    day: number;
    events: Event[];
}

export const Day: React.FC<DayProps> = ({ day, events }) => {
    return (
        <div className="border p-2 h-36 overflow-hidden relative">
            <div className="text-right">{day}</div>
            <div className="overflow-hidden h-full">
                {events.map((event, idx) => (
                    <div key={idx} className="flex justify-between whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-sm text-blue-500">{event.name}</span>
                        <div className="text-xs text-gray-500">{event.time}</div>
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
