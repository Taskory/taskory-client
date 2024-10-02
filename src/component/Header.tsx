import React from "react";
import { useSidebarStateContext } from "../context/SidebarStateContext";
import { useNavigate } from "react-router-dom";
import { existAuthCookie, removeAuthCookie } from "../util/CookieUtil";

export const Header: React.FC = () => {
    const { toggleLeftbar } = useSidebarStateContext();
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

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="flex justify-between items-center border-b">
                <div className="flex">
                    {/* Leftbar toggle button */}
                    <div
                        onClick={toggleLeftbar}
                        className="ml-4 flex items-center cursor-pointer hover:bg-gray-200"
                    >
                        <img className="h-8 w-auto" src={"/asset/img/header/menu.svg"} alt={"Menu"} />
                    </div>
                </div>
                <div className="flex items-center">
                    <img className="mr-2 h-8 w-auto" src={"/asset/img/logo.png"} alt={"Logo"} />
                    <span className="font-semibold">Taskflower</span>
                </div>
                <div className="flex items-center">
                    {/* Profile img */}
                    {existAuthCookie() && (
                        <div
                            onClick={navigateToProfile}
                            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-full"
                        >
                            <img
                                src={"/asset/img/logo.png"}
                                alt={"Profile"}
                                className="h-8 w-8 rounded-full"
                            />
                        </div>
                    )}

                    {/* Login/Logout button */}
                    <div className="ml-4">
                        {existAuthCookie() ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
