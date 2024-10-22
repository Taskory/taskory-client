// src/components/Rightbar.tsx
import React from "react";
import { useSidebarStateContext } from "../../../context/SidebarStateContext";
import { MiniCalendar } from "./component/MiniCalendar";
import { RightbarBtn } from "./component/RightbarBtn";
import { RightbarContents } from "./component/RightbarContents";

export const Rightbar: React.FC = () => {
    const { isRightbarOpened } = useSidebarStateContext();

    return (
        <div
            className={`transition-all duration-200 flex flex-col justify-between items-center bg-base-100 shadow rounded h-full p-2 ${
                isRightbarOpened ? "w-sidebarOpened" : "w-sidebarClosed"
            }`}
        >
            <div className="w-full">
                <RightbarBtn />

                {isRightbarOpened && (<RightbarContents />)}
            </div>

            {isRightbarOpened && (
                <div className="w-full mt-auto">
                    <MiniCalendar />
                </div>
            )}
        </div>
    );
};


