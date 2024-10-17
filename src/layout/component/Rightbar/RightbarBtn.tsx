import React from "react";
import {useSidebarStateContext} from "../../../context/SidebarStateContext";

export const RightbarBtn: React.FC = () => {
    const { isRightbarOpened, toggleRightbar } = useSidebarStateContext();
    return (
        <div
            onClick={toggleRightbar}
            className="flex items-center p-2 cursor-pointer hover:bg-base-200 border-b w-full justify-end transition-all duration-300 bg-base-100 shadow-md rounded-lg"
        >
            <img
                className={`mr-2 transition-transform duration-300 ${
                    isRightbarOpened ? "rotate-180" : ""
                }`}
                src={"/asset/img/rightbar/open-close-button.svg"}
                alt={"RightbarBtn"}
            />
        </div>
    );}
