import React, { useState, useEffect } from 'react';
import { EventInterface } from "../../../../../api/interface/EventInterface";
import { Cell } from './Cell'; // Adjust the import path as necessary

interface DayProps {
    day: number;
    events: EventInterface[];
}

export const DayCell: React.FC<DayProps> = ({ day, events }) => {
    const [maxItemLength, setMaxItemLength] = useState<number>(4); 
    const [windowSize, setWindowSize] = useState<number>(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (windowSize <= 880) {
            setMaxItemLength(1);
        } else if (windowSize > 880 && windowSize <= 1030) {
            setMaxItemLength(2);
        } else {
            setMaxItemLength(4);
        }
    }, [windowSize]);

    return (
        <Cell className={`h-full grid lg:grid-rows-${maxItemLength+1} grid-rows-${maxItemLength+1}`}>
            <div className="text-left ml-2 mt-1 h-full row-span-1">{day}</div>
            <div className={`overflow-hidden h-full flex flex-col-reverse mb-1 lg:row-span-${maxItemLength+1} row-span-${maxItemLength+1}`}>
                {events.length > maxItemLength && (
                    <div className="bottom-0 left-0 w-full text-center text-xs text-gray-500">
                        more..
                    </div>
                )}
                {events.slice(0, maxItemLength).map((event, idx) => {
                    const textColor = `text-${event.tag.color.toLowerCase()}-500`;
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
