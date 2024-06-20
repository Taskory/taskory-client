import React from 'react';

interface HeaderProps {
    isOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOpened }) => {
    return (
        <header
            className={`bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center fixed top-0 ${
                isOpened ? 'left-20' : 'left-72'
            } right-0 h-16 transition-all duration-300`}
        >
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="border rounded px-4 py-2 mr-4"
                />
            </div>
            <div className="flex items-center">
                <img src="/asset/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
                <img src="/asset/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
            </div>
        </header>
    );
};
