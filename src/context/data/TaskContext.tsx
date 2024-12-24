import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {TaskStatus, TaskSummary} from "../../api/task/TaskTypes";
import {request_getTasksByTags, request_updateTaskStatus} from "../../api/task/TaskApi";
import {useTagContext} from "./TagContext";
import {getDeadline} from "../../util/TaskUtil";

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
            const taskData: TaskSummary[] = await request_getTasksByTags(selectedTagIds);

            const categorizedTasks = {
                BACKLOG: [] as TaskSummary[],
                TODO: [] as TaskSummary[],
                PROGRESS: [] as TaskSummary[],
                DONE: [] as TaskSummary[],
            };

            taskData.forEach(task => {
                categorizedTasks[task.status]?.push(task);
            });

            // 한 번에 상태 업데이트
            setBACKLOG(categorizedTasks.BACKLOG);
            setTODO(categorizedTasks.TODO);
            setPROGRESS(categorizedTasks.PROGRESS);
            setDONE(categorizedTasks.DONE);
        } catch (error) {
            console.error('Error fetching Tasks:', error);
        }
    }, [selectedTagIds]);

    const moveTaskItem = async (taskItem: TaskSummary, toStatus: TaskStatus) => {
        if (taskItem.status === toStatus) return; // 기존 상태와 동일하면 요청하지 않음
        
        const toDeadline = getDeadline(taskItem.deadline, toStatus, taskItem.event?.dueDateTime ?? null);

        try {
            const updatedTask = await request_updateTaskStatus(taskItem.id, toStatus, toDeadline);
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
                        setTODO(prevPROGRESS => [...prevPROGRESS, updatedTask]);
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