import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {TaskStatus, TaskSummary} from "../../api/task/TaskTypes";
import {request_getAllTasks, request_getTasksByTags, request_updateTaskStatus} from "../../api/task/TaskApi";
import {useTagContext} from "./TagContext";

interface TaskContextProps {
    TO_DO: TaskSummary[],
    IN_PROGRESS: TaskSummary[],
    DONE: TaskSummary[],
    fetchOriginTasks: () => void;
    moveTaskItem: (taskItem: TaskSummary, toContainerId: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskContextProviderProps {
    children: ReactNode;
}

export const TaskContextProvider: React.FC<TaskContextProviderProps> = ({ children }) => {
    const {selectedTagIds} = useTagContext();
    const [TO_DO, setTO_DO] = useState<TaskSummary[]>([]);
    const [IN_PROGRESS, setIN_PROGRESS] = useState<TaskSummary[]>([]);
    const [DONE, setDONE] = useState<TaskSummary[]>([]);

    const fetchOriginTasks = useCallback(async () => {
        try {
            // const taskData: TaskSummary[] = await request_getAllTasks(); // Fetch tasks using getAllTasks
            const taskData: TaskSummary[] = await request_getTasksByTags(selectedTagIds);

            const toDoTasks: TaskSummary[] = [];
            const inProgressTasks: TaskSummary[] = [];
            const doneTasks: TaskSummary[] = [];

            taskData.forEach(task => {
                switch (task.status) {
                    case TaskStatus.TO_DO:
                        toDoTasks.push(task);
                        break;
                    case TaskStatus.IN_PROGRESS:
                        inProgressTasks.push(task);
                        break;
                    case TaskStatus.DONE:
                        doneTasks.push(task);
                        break;
                    default:
                        console.warn(`Unknown status: ${task.status}`);
                }
            });

            setTO_DO(toDoTasks);
            setIN_PROGRESS(inProgressTasks);
            setDONE(doneTasks);
        } catch (error) {
            console.error('Error fetching Tasks:', error);
        }
    }, [selectedTagIds]);

    const moveTaskItem = async (taskItem: TaskSummary, toStatus: TaskStatus) => {
        if (taskItem.status === toStatus) return; // if status of task item equals toStatus not request

        try {
            const result = await request_updateTaskStatus(taskItem.id, toStatus);
            if (result) {
                switch (taskItem.status) {
                    case TaskStatus.TO_DO:
                        setTO_DO(prevTO_DO => prevTO_DO.filter(task => task.id !== taskItem.id));
                        break;
                    case TaskStatus.IN_PROGRESS:
                        setIN_PROGRESS(prevIN_PROGRESS => prevIN_PROGRESS.filter(task => task.id !== taskItem.id));
                        break;
                    case TaskStatus.DONE:
                        setDONE(prevDONE => prevDONE.filter(task => task.id !== taskItem.id));
                        break;
                }

                taskItem.status = toStatus;
                switch (toStatus) {
                    case TaskStatus.TO_DO:
                        setTO_DO(prevTO_DO => [...prevTO_DO, taskItem]);
                        break;
                    case TaskStatus.IN_PROGRESS:
                        setIN_PROGRESS(prevIN_PROGRESS => [...prevIN_PROGRESS, taskItem]);
                        break;
                    case TaskStatus.DONE:
                        setDONE(prevDONE => [...prevDONE, taskItem]);
                        break;
                }
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    useEffect(() => {
        fetchOriginTasks();
    }, [fetchOriginTasks]);

    const contextValue: TaskContextProps = useMemo(() => ({
        TO_DO,
        IN_PROGRESS,
        DONE,
        fetchOriginTasks,
        moveTaskItem
    }), [TO_DO, IN_PROGRESS, DONE, fetchOriginTasks]);

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = (): TaskContextProps => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within an TaskContextProvider');
    }
    return context;
};