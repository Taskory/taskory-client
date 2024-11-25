import React from 'react';
import { CommonHeader } from './component/Header/CommonHeader';
import { Leftbar } from './component/Leftbar';
import { Rightbar } from './component/Rightbar/Rightbar';
import {TagContextProvider} from "../context/data/TagContext";
import { Outlet } from 'react-router-dom';


export const CommonLayout: React.FC = () => {
    return (
        <TagContextProvider>
            <div className="h-screen w-screen flex flex-col overflow-hidden">
                {/* Header */}
                <CommonHeader/>
                {/* Main Content with Leftbar and Rightbar */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Leftbar */}
                    <Leftbar/>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-auto ">
                        <Outlet />
                    </div>

                    {/* Rightbar */}
                    <Rightbar/>
                </div>
            </div>
        </TagContextProvider>
    );
};
