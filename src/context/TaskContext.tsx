import React, {createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect} from 'react';
import {TaskSummary} from "../api/task/TaskTypes";
import {getAllTasks} from "../api/task/TaskApi";

interface TaskContextProps {
    TO_DO: TaskSummary[],
    IN_PROGRESS: TaskSummary[],
    DONE: TaskSummary[]
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskContextProviderProps {
    children: ReactNode;
}

export const TaskContextProvider: React.FC<TaskContextProviderProps> = ({ children }) => {
    const [TO_DO, setTO_DO] = useState<TaskSummary[]>([]);
    const [IN_PROGRESS, setIN_PROGRESS] = useState<TaskSummary[]>([]);
    const [DONE, setDONE] = useState<TaskSummary[]>([]);

    const fetchTasks = useCallback(async () => {
        try {
            const taskData: TaskSummary[] = await getAllTasks(); // Fetch tasks using getAllTasks

            const toDoTasks: TaskSummary[] = [];
            const inProgressTasks: TaskSummary[] = [];
            const doneTasks: TaskSummary[] = [];

            taskData.forEach(task => {
                switch (task.status) {
                    case "TO_DO":
                        toDoTasks.push(task);
                        break;
                    case "IN_PROGRESS":
                        inProgressTasks.push(task);
                        break;
                    case "DONE":
                        doneTasks.push(task);
                        break;
                    default:
                        console.warn(`Unknown status: ${task.status}`);
                }
            });

            // 상태에 따라 분류된 배열을 set 함수로 업데이트합니다.
            setTO_DO(toDoTasks);
            setIN_PROGRESS(inProgressTasks);
            setDONE(doneTasks);
        } catch (error) {
            console.error('Error fetching Tasks:', error);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const contextValue: TaskContextProps = useMemo(() => ({
        TO_DO,
        IN_PROGRESS,
        DONE
    }), [TO_DO, IN_PROGRESS, DONE]);

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