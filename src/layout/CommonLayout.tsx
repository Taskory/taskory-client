import React, {  ReactNode } from 'react';
import { Header } from './component/Header';
import { Leftbar } from './component/Leftbar';
import { Rightbar } from './component/Rightbar';
import {TagContextProvider} from "../context/TagContext";


interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({children}) => {
    return (
        <TagContextProvider>
            <div className="h-screen w-screen flex flex-col overflow-hidden">
                {/* Header */}
                <Header/>
                {/* Main Content with Leftbar and Rightbar */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Leftbar */}
                    <Leftbar/>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-auto ">
                        {children}
                    </div>

                    {/* Rightbar */}
                    <Rightbar/>
                </div>
            </div>
        </TagContextProvider>
    );
};
