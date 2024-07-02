import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

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
    const leftbarOpenedKey = "leftbar-opened";
    const leftbarOpened = localStorage.getItem(leftbarOpenedKey) || 'false';
    const [isLeftbarOpened, setLeftbarOpened] = useState(JSON.parse(leftbarOpened));
    const rightbarOpenedKey = "rightbar-opened";
    const rightbarOpened = localStorage.getItem(rightbarOpenedKey) || 'false';
    const [isRightbarOpened, setRightbarOpened] = useState(JSON.parse(rightbarOpened));

    const toggleLeftbar = () => {
        setLeftbarOpened(!isLeftbarOpened);
    };

    const toggleRightbar = () => {
        setRightbarOpened(!isRightbarOpened);
    };

    useEffect(() => {
        localStorage.setItem(leftbarOpenedKey, JSON.stringify(isLeftbarOpened));
    }, [isLeftbarOpened]);

    useEffect(() => {
        localStorage.setItem(rightbarOpenedKey, JSON.stringify(isRightbarOpened));
    }, [isRightbarOpened]);

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
