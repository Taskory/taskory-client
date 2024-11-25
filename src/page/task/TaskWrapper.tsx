import React from 'react';
import { TaskContextProvider } from '../../context/data/TaskContext';
import {TaskModalProvider} from "./context/TaskModalContext";

interface TaskLayoutProps {
    children: React.ReactNode;
}

export const TaskWrapper: React.FC<TaskLayoutProps> = ({children}) => {
    return (
        <TaskContextProvider>
            <TaskModalProvider>
                {children}
            </TaskModalProvider>
        </TaskContextProvider>
    );
};
