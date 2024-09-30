import React, {  ReactNode } from 'react';
import { Header } from '../component/Header';
import { Leftbar } from '../component/Leftbar';
import { Rightbar } from '../component/Rightbar';


interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <Header />
            {/* Main Content with Leftbar and Rightbar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Leftbar */}
                <Leftbar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto p-4">
                    {children}
                </div>

                {/* Rightbar */}
                <Rightbar />
            </div>
        </div>
    );
};