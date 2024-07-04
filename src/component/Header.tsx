import React from 'react';
import { existAuthCookie, removeAuthCookie } from "../util/CookieUtil";
import { useNavigate } from "react-router-dom";
import { useSidebarStateContext } from "../context/SidebarStateContext";

export const Header: React.FC = () => {
    const { isLeftbarOpened } = useSidebarStateContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (existAuthCookie()) {
            removeAuthCookie();
            navigate("/");
        }
    };

    const navigateToProfile = () => {
        navigate("/profile");
    };

    return (
        <header
            className={`bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center fixed top-0 ${
                isLeftbarOpened ? 'left-24' : 'left-72'
            } right-0 h-16 transition-all duration-300`}
        >
            <div className="flex items-center w-full space-x-4">
                <div className="flex border rounded-lg px-2 items-center w-1/4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-2 py-1 border-none outline-none flex-grow"
                        aria-label="Search"
                    />
                    <button
                        className="btn btn-circle btn-sm bg-base-100 border-none"
                        aria-label="Search Button"
                    >
                        <img src="/asset/img/header/search.svg" alt="search" className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4 mr-10">
                <button className="btn btn-circle bg-white" aria-label="Notifications">
                    <img src="/asset/img/header/notification.svg" alt="notification" className="h-8 w-8"/>
                </button>
                <button className="btn bg-white" aria-label="Profile">
                    <img
                        src="/asset/img/Logo.png"
                        alt="Logo"
                        className="h-8 w-8"
                        onClick={navigateToProfile}
                    />
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};
