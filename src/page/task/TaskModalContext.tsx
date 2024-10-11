import React, { createContext, useContext, useMemo, useCallback, ReactNode, useState } from 'react';
import { TaskModal } from './TaskModal';
import { useTaskContext } from "../../context/TaskContext";

interface TaskModalContextType {
    openTaskModal: (taskId?: number) => void;
    closeTaskModal: () => void;
    selectedTaskId: number | null;
    isModalOpen: boolean;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { refetchTasks } = useTaskContext();
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeTaskModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTaskId(null);
        refetchTasks();
    }, [refetchTasks]);

    const openTaskModal = useCallback((taskId?: number) => {
        if (taskId) {
            setSelectedTaskId(taskId);
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
                    loading={false}
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
