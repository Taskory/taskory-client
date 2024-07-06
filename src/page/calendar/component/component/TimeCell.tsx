import React from 'react';
import { EventInterface } from '../../../../api/interface/EventInterface';

interface TimeCellProps {
    events: EventInterface[];
}

export const TimeCell: React.FC<TimeCellProps> = ({ events }) => {
    return (
        <div className={`w-full h-20 grid  grid-cols-${events.length} ${(events.length > 0) ? '' : 'border'}`}>
            {events.map((event, idx) => (
                <div key={idx} className={`col-span-1 p-1 text-xs bg-${event.tag.color.toLowerCase()}-200 w-full h-full`}>
                    {event.title}
                </div>
            ))}
        </div>
    );
};