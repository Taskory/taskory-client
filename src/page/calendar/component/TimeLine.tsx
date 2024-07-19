import React from "react";

export const TimeLine = () => {
    return (
        <>
            <div
                className="h-weekCalendarCellHeight border-t border-gray-200 flex items-start justify-end pr-1 text-xs font-semibold">
                all day events
            </div>
            {Array.from({length: 24}, (_, hour: number) => (
                <div key={hour}
                     className="h-weekCalendarCellHeight border-t border-gray-200 flex items-start justify-end pr-1 text-xs font-semibold">
                    {hour}:00
                </div>
            ))}
        </>
    );
};