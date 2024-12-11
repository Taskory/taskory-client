import React from "react";
import {EventModalProvider} from "../../modal/context/EventModalContext";
import {TaskModalProvider} from "../../modal/context/TaskModalContext";

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