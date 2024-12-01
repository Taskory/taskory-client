import React from 'react';
import { CommonHeader } from './component/Header/CommonHeader';
import { Leftbar } from './component/Leftbar';
import { Rightbar } from './component/Rightbar/Rightbar';
import { Outlet } from 'react-router-dom';
import {DataWrapper} from "./wrapper/DataWrapper";
import {ModalWrapper} from "./wrapper/ModalWrapper";


export const CommonLayout: React.FC = () => {
    return (
        <DataWrapper>
            <ModalWrapper>
                <div className="h-screen w-screen flex flex-col overflow-hidden">
                    {/* Header */}
                    <CommonHeader/>
                    {/* Main Content with Leftbar and Rightbar */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Leftbar */}
                        <Leftbar/>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col overflow-auto ">
                            <Outlet/>
                        </div>

                        {/* Rightbar */}
                        <Rightbar/>
                    </div>
                </div>
            </ModalWrapper>
        </DataWrapper>
    );
};
