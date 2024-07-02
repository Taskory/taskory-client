import React, {ReactNode, useEffect} from 'react';
import { LeftBar } from '../component/LeftBar';
import { Header } from '../component/Header';
import { RightBar } from '../component/RightBar';
import {useSidebarStateContext} from "../context/SidebarStateContext";

interface CommonLayoutProps {
    children: ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const {isLeftbarOpened} = useSidebarStateContext();
    useEffect(() => {
        // 드래그 방지 이벤트 핸들러
        const preventDefault = (e: Event) => {
            e.preventDefault();
        };

        // 드래그 방지 이벤트 리스너 등록
        document.addEventListener('dragstart', preventDefault);
        document.addEventListener('drop', preventDefault);

        // 클린업 함수
        return () => {
            document.removeEventListener('dragstart', preventDefault);
            document.removeEventListener('drop', preventDefault);
        };
    }, []);

    return (
        <div className="flex h-full">
            <LeftBar />
            <div
                className={`flex flex-col flex-grow transition-all duration-300 ${isLeftbarOpened ? 'ml-24' : 'ml-72'}`}>
                <Header />
                <div className="flex flex-grow mt-16">
                    <main className="flex-grow m-4">
                        {children}
                    </main>
                    <RightBar />
                </div>
            </div>
        </div>
    );
};
