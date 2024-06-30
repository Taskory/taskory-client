import React from "react";

interface EmptyCellsProps {
    count: number;
    startIndex: number;
}

export const EmptyCells: React.FC<EmptyCellsProps> = ({ count, startIndex }) => {
    return (
        <>
            {Array(count).fill(null).map((_, index) => (
                <div key={startIndex + index} className="border p-2 h-36"></div>
            ))}
        </>
    );
};