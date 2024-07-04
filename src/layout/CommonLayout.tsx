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

    useEffect(() => {
        // Drag prevention event handler
        const preventDefault = (e: Event) => {
            e.preventDefault();
        };

        // Register drag prevention event listeners
        document.addEventListener('dragstart', preventDefault);
        document.addEventListener('drop', preventDefault);

        // Cleanup function
        return () => {
            document.removeEventListener('dragstart', preventDefault);
            document.removeEventListener('drop', preventDefault);
        };
    }, []);

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <LeftBar />
            <div className={`w-full h-full flex flex-col flex-grow transition-all duration-300 ${isLeftbarOpened ? 'ml-24' : 'ml-72'}`}>
                <Header />
                <div className="flex flex-grow mt-16">
                    <main className="flex-grow p-4">
                        {children}
                    </main>
                    <RightBar />
                </div>
            </div>
        </div>
    );
};
