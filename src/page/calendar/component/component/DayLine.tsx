import React from 'react';
import { EventInterface } from "../../../../api/interface/EventInterface";
import { TimeCell } from './TimeCell'; // Adjust the import path as necessary

interface DayProps {
    hourlyEvents: EventInterface[][];
}

export const DayLine: React.FC<DayProps> = ({ hourlyEvents }) => {
    return (
        <>
            {hourlyEvents.map((events, hour) => (
                <TimeCell key={hour}  events={events}/>
            ))}
        </>
    );
};
