import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from 'react';
import {TaskModal} from '../TaskModal';
import {useTaskContext} from "../../context/data/TaskContext";
import {TaskStatus} from "../../api/task/TaskTypes";

interface TaskModalContextType {
    openTaskModal: (taskIdOrStatus?: number | TaskStatus) => void;
    closeTaskModal: () => void;
    selectedTaskId: number | null;
    isModalOpen: boolean;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { fetchOriginTasks } = useTaskContext();
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(TaskStatus.BACKLOG);

    const closeTaskModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTaskId(null);
        fetchOriginTasks();
    }, [fetchOriginTasks]);

    const openTaskModal = useCallback((taskIdOrStatus?: number | TaskStatus) => {
        if (taskIdOrStatus) {
            if (typeof taskIdOrStatus === "number") {       // if getting task id
                const taskId = taskIdOrStatus;
                if (taskId) {
                    setSelectedTaskId(taskId);
                }
            } else {                // if getting status
                const taskStatus: TaskStatus = taskIdOrStatus;
                setSelectedStatus(taskStatus)
            }
        }
        setIsModalOpen(true);
    }, []);

    const contextValue: TaskModalContextType = useMemo(() => ({
        openTaskModal,
        selectedTaskId,
        isModalOpen,
        closeTaskModal
    }), [openTaskModal, closeTaskModal, isModalOpen, selectedTaskId]);

    return (
        <TaskModalContext.Provider value={contextValue}>
            {children}
            {isModalOpen && (
                <TaskModal
                    selectedStatus={selectedStatus}
                />
            )}
        </TaskModalContext.Provider>
    );
};

// Hook to access the TaskModal context
export const useTaskModal = (): TaskModalContextType => {
    const context = useContext(TaskModalContext);
    if (context === undefined) {
        throw new Error('useTaskModal must be used within a TaskModalProvider');
    }
    return context;
};
