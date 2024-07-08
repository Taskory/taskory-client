import React, { useEffect, useState } from 'react';
import { EventInterface } from '../../../../api/interface/EventInterface';

interface TimeCellProps {
    events: EventInterface[];
}

export const TimeCell: React.FC<TimeCellProps> = ({ events }) => {
    const getGridCols = (count: number) => {
        return `grid-cols-${count}`
    };


    return (
        <div className={`h-20 grid ${events.length > 0 ? getGridCols(events.length) : 'border'}`}>
            {events.map((event, index) => (
                <div
                    key={index}
                    className={`p-1 text-xs bg-${event.tag.color.toLowerCase()}-200 w-full h-full`}
                >
                    {event.title}
                </div>
            ))}
        </div>
    );
};
