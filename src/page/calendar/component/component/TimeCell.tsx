import React from 'react';
import { EventInterface } from '../../../../api/interface/EventInterface';

interface TimeCellProps {
    events: EventInterface[];
}

export const TimeCell: React.FC<TimeCellProps> = ({ events }) => {
    return (
        <div className={`border-4`}>
            {events.map((event, idx) => (
                <div key={idx} className={`text-xs px-1 bg-${event.tag.color.toLowerCase()}-200`}>
                    {event.title}
                </div>
            ))}
        </div>
    );
};