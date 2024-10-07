// TimeColumn common for rendering time slots
import React from "react";

export const TimeColumn: React.FC = () => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return (
        <div className="border-r">
            {hours.map((hour) => (
                <div key={hour} className="h-16 border-b flex justify-end items-start">
                    {hour}
                </div>
            ))}
        </div>
    );
};
