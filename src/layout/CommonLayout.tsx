import React, {ReactNode} from 'react';
import { LeftBar } from '../component/LeftBar';
import { Header } from '../component/Header';
import { RightBar } from '../component/RightBar';
import { Footer } from '../component/Footer';
import {useSidebarStateContext} from "../context/SidebarStateContext";

interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const { isLeftbarOpened, toggleLeftbar, isRightbarOpened, toggleRightbar } = useSidebarStateContext();

    return (
        <>
            <div className="flex">
                <LeftBar isOpened={isLeftbarOpened} toggle={toggleLeftbar} />
                <div className={`flex flex-col flex-grow transition-all duration-300 ${isLeftbarOpened ? 'ml-20' : 'ml-72'}`}>
                    <Header isOpened={isLeftbarOpened} />
                    <div className="flex flex-grow mt-16 min-h-screen">
                        <main className="flex-grow p-4 bg-gray-100">
                            {children}
                        </main>
                        <RightBar isOpened={isRightbarOpened} toggle={toggleRightbar}/>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};
