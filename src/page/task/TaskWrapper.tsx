import React from 'react';
import { TaskContextProvider } from '../../context/TaskContext';
import { CommonLayout } from '../../layout/CommonLayout';
import {TaskModalProvider} from "./TaskModalContext";

interface TaskLayoutProps {
    children: React.ReactNode;
}

export const TaskWrapper: React.FC<TaskLayoutProps> = ({children}) => {
    return (
        <CommonLayout>
            <TaskContextProvider>
                <TaskModalProvider>
                    {children}
                </TaskModalProvider>
            </TaskContextProvider>
        </CommonLayout>
    );
};
