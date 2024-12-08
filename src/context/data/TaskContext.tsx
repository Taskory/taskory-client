import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {TaskStatus, TaskSummary} from "../../api/task/TaskTypes";
import {request_getTasksByTags, request_updateTaskStatus} from "../../api/task/TaskApi";
import {useTagContext} from "./TagContext";

interface TaskContextProps {
    BACKLOG: TaskSummary[],
    TODO: TaskSummary[],
    PROGRESS: TaskSummary[],
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
    const [TODO, setTODO] = useState<TaskSummary[]>([]);
    const [PROGRESS, setPROGRESS] = useState<TaskSummary[]>([]);
    const [DONE, setDONE] = useState<TaskSummary[]>([]);
    const [BACKLOG, setBACKLOG] = useState<TaskSummary[]>([]);

    const fetchOriginTasks = useCallback(async () => {
        try {
            // const taskData: TaskSummary[] = await request_getAllTasks(); // Fetch tasks using getAllTasks
            const taskData: TaskSummary[] = await request_getTasksByTags(selectedTagIds);

            const backlogTasks: TaskSummary[] = [];
            const toDoTasks: TaskSummary[] = [];
            const inProgressTasks: TaskSummary[] = [];
            const doneTasks: TaskSummary[] = [];

            taskData.forEach(task => {
                switch (task.status) {
                    case TaskStatus.BACKLOG:
                        backlogTasks.push(task);
                        break;
                    case TaskStatus.TODO:
                        toDoTasks.push(task);
                        break;
                    case TaskStatus.PROGRESS:
                        inProgressTasks.push(task);
                        break;
                    case TaskStatus.DONE:
                        doneTasks.push(task);
                        break;
                    default:
                        console.warn(`Unknown status: ${task.status}`);
                }
            });

            setBACKLOG(backlogTasks);
            setTODO(toDoTasks);
            setPROGRESS(inProgressTasks);
            setDONE(doneTasks);
        } catch (error) {
            console.error('Error fetching Tasks:', error);
        }
    }, [selectedTagIds]);

    const moveTaskItem = async (taskItem: TaskSummary, toStatus: TaskStatus) => {
        if (taskItem.status === toStatus) return; // 기존 상태와 동일하면 요청하지 않음

        try {
            const updatedTask = await request_updateTaskStatus(taskItem.id, toStatus); // 업데이트된 TaskSummary 반환
            if (updatedTask) {
                // 기존 상태에서 task 제거
                switch (taskItem.status) {
                    case TaskStatus.BACKLOG:
                        setBACKLOG(prevBACKLOG => prevBACKLOG.filter(task => task.id !== taskItem.id));
                        break;
                    case TaskStatus.TODO:
                        setTODO(prevTODO => prevTODO.filter(task => task.id !== taskItem.id));
                        break;
                    case TaskStatus.PROGRESS:
                        setPROGRESS(prevPROGRESS => prevPROGRESS.filter(task => task.id !== taskItem.id));
                        break;
                    case TaskStatus.DONE:
                        setDONE(prevDONE => prevDONE.filter(task => task.id !== taskItem.id));
                        break;
                }

                // 상태 변경 후 updatedTask로 리스트에 추가
                switch (toStatus) {
                    case TaskStatus.BACKLOG:
                        setBACKLOG(prevBACKLOG => [...prevBACKLOG, updatedTask]);
                        break;
                    case TaskStatus.TODO:
                        setTODO(prevTODO => [...prevTODO, updatedTask]);
                        break;
                    case TaskStatus.PROGRESS:
                        setPROGRESS(prevPROGRESS => [...prevPROGRESS, updatedTask]);
                        break;
                    case TaskStatus.DONE:
                        setDONE(prevDONE => [...prevDONE, updatedTask]);
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
        BACKLOG,
        TODO,
        PROGRESS,
        DONE,
        fetchOriginTasks,
        moveTaskItem
    }), [BACKLOG, TODO, PROGRESS, DONE, fetchOriginTasks]);

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