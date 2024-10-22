import React from "react";
import {ProfileBtn} from "./component/ProfileBtn";
import {AuthBtn} from "./component/AuthBtn";
import {LogoBtn} from "../common/LogoBtn";

export const HomeHeader = () => {
    return (
        <div className="flex justify-between items-center border-b">
            {/* 1st space*/}
            <div className="w-20"/>

            {/* 2nd space */}
            <LogoBtn />

            {/* 3rd space */}
            <div className="flex items-center justify-start">
                {/* Profile img */}
                <ProfileBtn/>

                {/* Login/Logout button */}
                <AuthBtn/>
            </div>
        </div>
    );
};