import React from "react";
import { useSidebarStateContext } from "../context/SidebarStateContext";

export const Rightbar = () => {
    const { isRightbarOpened, toggleRightbar } = useSidebarStateContext();

    return (
        <>
            <div
                className={`transition-all duration-300 flex flex-col items-center ${
                    isRightbarOpened ? 'w-64' : 'w-16'
                }`}
            >

                {/* Rightbar toggle button */}
                <div
                    onClick={toggleRightbar}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200 border-b w-full justify-end"
                >
                    <img
                        className={`mr-2 transition-transform duration-300 ${
                            isRightbarOpened ? 'rotate-180' : ''
                        }`}
                        src={"/asset/img/rightbar/open-close-button.svg"}
                        alt={"RightbarBtn"}
                    />
                </div>

                {/* Rightbar content */}
                {isRightbarOpened && (<Contents />)}
            </div>
        </>
    );
};

const Contents = () => {
    return (
        <>
            <div className="p-4">
                <h2>Right Sidebar Content</h2>
                {/* Add more rightbar content here */}
            </div>
        </>
    );
};
