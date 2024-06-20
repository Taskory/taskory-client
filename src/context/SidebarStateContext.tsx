import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarStateContextProps {
    isLeftbarOpened: boolean;
    isRightbarOpened: boolean;
    toggleLeftbar: () => void;
    toggleRightbar: () => void;
}

const SidebarStateContext = createContext<SidebarStateContextProps | undefined>(undefined);

interface SidebarStateProviderProps {
    children: ReactNode;
}

export const SidebarStateProvider: React.FC<SidebarStateProviderProps> = ({ children }) => {
    const [isLeftbarOpened, setLeftbarOpened] = useState(false);
    const [isRightbarOpened, setRightbarOpened] = useState(false);

    const toggleLeftbar = () => {
        setLeftbarOpened(!isLeftbarOpened);
    };

    const toggleRightbar = () => {
        setRightbarOpened(!isRightbarOpened);
    };

    return (
        <SidebarStateContext.Provider value={{ isLeftbarOpened, isRightbarOpened, toggleLeftbar, toggleRightbar }}>
            {children}
        </SidebarStateContext.Provider>
    );
};

export const useSidebarStateContext = (): SidebarStateContextProps => {
    const context = useContext(SidebarStateContext);
    if (!context) {
        throw new Error('useSidebarStateContext must be used within a SidebarStateProvider');
    }
    return context;
};
