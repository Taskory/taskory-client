import React, { useEffect, useState } from 'react';
import { CommonLayout } from '../../layout/CommonLayout';
import { TaskBoard } from './TaskBoard';
import { TaskHeader } from './TaskHeader';
import {TaskSummary} from "../../api/task/TaskTypes";
import {getAllTasks} from "../../api/task/TaskApi";
import {TaskModalProvider} from "./TaskModalContext";

export const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<TaskSummary[]>([]);  // State to store the fetched tasks
    const [loading, setLoading] = useState<boolean>(true);  // Loading state

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const taskData = await getAllTasks();  // Fetch tasks using getAllTasks
                setTasks(taskData);  // Set fetched tasks to state
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);  // Set loading to false once tasks are fetched
            }
        };

        fetchTasks();
    }, []);  // Empty dependency array to call useEffect only on component mount

    return (
        <CommonLayout>
            <TaskModalProvider>
                <div className="flex flex-col h-full">
                    {/* TaskHeader Component */}
                    <TaskHeader/>

                    {/* Boards Section */}
                    <div className="flex gap-2 p-2">
                        {loading ? (
                            <p>Loading tasks...</p>
                        ) : (
                            <>
                                {/* Filter tasks into boards based on their status */}
                                <TaskBoard title="ToDo" tasks={tasks.filter(task => task.status === 'ToDo')}/>
                                <TaskBoard title="In Progress"
                                           tasks={tasks.filter(task => task.status === 'In Progress')}/>
                                <TaskBoard title="Done" tasks={tasks.filter(task => task.status === 'Done')}/>
                            </>
                        )}
                    </div>
                </div>
            </TaskModalProvider>
        </CommonLayout>
    );
};
