import React, { ReactNode } from 'react';
import { LeftBar } from '../component/LeftBar';
import { Header } from '../component/Header';
import { RightBar } from '../component/RightBar';
import {Footer} from "../component/Footer";

interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="flex min-h-screen">
                <LeftBar/>
                <div className="flex flex-col flex-grow">
                    <Header/>
                    <div className="flex flex-grow">
                        <main className="flex-grow p-4 bg-gray-100">
                            {children}
                        </main>
                        <RightBar/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};
