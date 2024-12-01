import React from "react";
import {EventModalProvider} from "../../context/modal/EventModalContext";
import {TaskModalProvider} from "../../context/modal/TaskModalContext";

interface ModalWrapperProps {
    children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({children}) => {
    return (
        <>
            <EventModalProvider>
                <TaskModalProvider>
                    {children}
                </TaskModalProvider>
            </EventModalProvider>
        </>
    );
};