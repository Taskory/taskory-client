import React from 'react';
import {HomeHeader} from "./component/Header/HomeHeader";
import {Footer} from "./component/Footer";
import {Outlet} from "react-router-dom";


export const HomeLayout: React.FC = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <header>
                    <HomeHeader/>
                </header>
                <main className="flex-grow">
                    <Outlet />
                </main>
            </div>
            <footer>
                <Footer/>
            </footer>
        </>
    );
};
