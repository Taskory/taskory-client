import React from 'react';

interface HeaderProps {
    isOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOpened }) => {
    return (
        <header
            className={`bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center fixed top-0 ${
                isOpened ? 'left-24' : 'left-72'
            } right-0 h-16 transition-all duration-300`}
        >
            <div className="flex items-center w-full">
                <div className="flex border rounded w-1/4 px-2 items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-2 py-1 border-none outline-none flex-grow"
                    />
                    <button className="btn btn-circle btn-sm border-none bg-base-100 h-10 w-10 flex items-center justify-center">
                        <img src="/src/asset/img/header/search.svg" alt="search" className="h-6 w-6"/>
                    </button>
                </div>
            </div>
            <div className="flex items-center">
                <img src="/src/asset/img/header/notification.svg" alt="notification" className="h-8 w-8 mr-2"/>
                <img src="/src/asset/img/Logo.png" alt="Logo" className="h-8 w-8 mr-2"/>
            </div>
        </header>
    );
};
