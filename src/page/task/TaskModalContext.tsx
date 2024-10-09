// TaskModalContext.tsx
import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import TaskModal from './TaskModal';

interface TaskModalContextType {
    openTaskModal: (taskId?: number) => void;
    closeTaskModal: () => void;
    selectedTaskId: number | null;
    isModalOpen: boolean;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeTaskModal = () => {
        setIsModalOpen(false);
        setSelectedTaskId(null);
    };

    const openTaskModal = (taskId?: number) => {
        if (taskId) {
            setSelectedTaskId(taskId);
        }
        setIsModalOpen(true);
    };

    const contextValue: TaskModalContextType = useMemo(() => ({
        openTaskModal,
        selectedTaskId,
        isModalOpen,
        closeTaskModal
    }), [isModalOpen, selectedTaskId]);

    return (
        <TaskModalContext.Provider value={contextValue}>
            {children}
            {isModalOpen && (
                <TaskModal
                    loading={false}
                    tags={[]}
                    hashtags={[]}
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