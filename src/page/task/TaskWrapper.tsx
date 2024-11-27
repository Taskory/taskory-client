import React from 'react';
import {TaskModalProvider} from "./context/TaskModalContext";

interface TaskLayoutProps {
    children: React.ReactNode;
}

export const TaskWrapper: React.FC<TaskLayoutProps> = ({children}) => {
    return (
        <TaskModalProvider>
            {children}
        </TaskModalProvider>
    );
};
