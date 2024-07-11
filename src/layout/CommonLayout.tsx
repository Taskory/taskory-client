import React, { ReactNode, useEffect } from 'react';
import { LeftBar } from '../component/LeftBar';
import { Header } from '../component/Header';
import { RightBar } from '../component/RightBar';
import { useSidebarStateContext } from "../context/SidebarStateContext";

interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const { isLeftbarOpened } = useSidebarStateContext();

    return (
        <div className="w-screen h-screen overflow-x-hidden">
            <div className="flex h-full w-full">
                <LeftBar />
                <div className={`w-full h-full flex flex-col flex-grow transition-all duration-300 ${isLeftbarOpened ? 'ml-leftbarOpened' : 'ml-leftbarClosed'}`}>
                    <Header />
                    <div className="w-full h-full">
                        <div className="flex w-full h-full pt-headerHeight">
                            <main className="flex-grow w-0 h-full">
                                {children}
                            </main>
                            <RightBar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
