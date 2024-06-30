import React from "react";
import { Cell } from './Cell'; // Adjust the import path as necessary

interface EmptyCellsProps {
    count: number;
    startIndex: number;
}

export const EmptyCells: React.FC<EmptyCellsProps> = ({ count, startIndex }) => {
    return (
        <>
            {Array(count).fill(null).map((_, index) => (
                <Cell key={startIndex + index} className="bg-gray-50" />
            ))}
        </>
    );
};
