import React from 'react';
import { EventInterface } from '../../../../api/interface/EventInterface';

interface TimeCellProps {
    events: EventInterface[];
}

export const TimeCell: React.FC<TimeCellProps> = ({ events }) => {
    return (
        <div className={`h-20 grid ${events.length > 0 ? `grid-cols-${events.length}` : 'border'}`}>
            {events.map((event, index) => (
                <div key={index} className={`p-1 text-xs text-center content-center bg-${event.tag.color.toLowerCase()}-400 w-full h-full`}>
                    {event.title}
                </div>
            ))}
        </div>
    );
};
