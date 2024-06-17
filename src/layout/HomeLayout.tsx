import React, { ReactNode } from 'react';
import {HomeHeader} from "../component/HomeHeader";
import {Footer} from "../component/Footer";

interface HomeLayoutProps {
    children: ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <HomeHeader/>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
};
