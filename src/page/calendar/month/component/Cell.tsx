import React from 'react';

interface CellProps {
    children?: React.ReactNode;
    className?: string;
}

export const Cell: React.FC<CellProps> = ({ children, className }) => {
    return (
        <div className={`border h-36 overflow-hidden relative flex flex-col ${className}`}>
            {children}
        </div>
    );
};
