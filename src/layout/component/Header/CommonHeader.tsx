import React from "react";
import { useSidebarStateContext } from "../../../context/SidebarStateContext";
import {ProfileBtn} from "./component/ProfileBtn";
import {AuthBtn} from "./component/AuthBtn";
import { LogoBtn } from "../common/LogoBtn";

export const CommonHeader: React.FC = () => {
    const { toggleLeftbar } = useSidebarStateContext();

    return (
        <>
            <div className="flex justify-between items-center border-b h-12">
                {/* 1st space*/}
                <div className="flex gap-4">
                    {/* Leftbar toggle button */}
                    <div
                        onClick={toggleLeftbar}
                        className="ml-4 flex items-center cursor-pointer hover:bg-gray-200"
                    >
                        <img className="h-8 w-auto" src={"/asset/img/header/menu.svg"} alt={"Menu"} />
                    </div>
                    
                    <LogoBtn />
                </div>

                {/* 2nd space */}
                <div className="flex items-center justify-start">
                    {/* Profile img */}
                    <ProfileBtn />

                    {/* Login/Logout button */}
                    <AuthBtn />
                </div>
            </div>
        </>
    );
};
