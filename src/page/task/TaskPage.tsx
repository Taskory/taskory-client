import React from 'react';
import { TaskContextProvider } from '../../context/TaskContext';
import { CommonLayout } from '../../layout/CommonLayout';
import { TaskBoard } from './TaskBoard';
import { TaskHeader } from './TaskHeader';
import {TaskModalProvider} from "./TaskModalContext";

export const TaskPage: React.FC = () => {
    return (
        <CommonLayout>
            <TaskContextProvider>
                <TaskModalProvider>
                    <div className="flex flex-col h-full">
                        {/* TaskHeader Component */}
                        <TaskHeader/>

                        {/* Boards Section */}
                        <div className="flex gap-2 p-2">
                            {/* Filter tasks into boards based on their status */}
                            <TaskBoard data="TO_DO"/>
                            <TaskBoard data="IN_PROGRESS"/>
                            <TaskBoard data="Done"/>
                        </div>
                    </div>
                </TaskModalProvider>
            </TaskContextProvider>
        </CommonLayout>
    );
};
