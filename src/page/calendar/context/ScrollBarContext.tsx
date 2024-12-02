import React, {createContext, useContext, useState, ReactNode, useMemo, useEffect, useRef, RefObject} from 'react';

interface ScrollBarContextType {
    scrollBarWidth: number;
    setScrollBarWidth: React.Dispatch<React.SetStateAction<number>>;
    scrollContainerRef: RefObject<HTMLDivElement> | null;
}

const ScrollBarContext = createContext<ScrollBarContextType | undefined>(undefined);

export const ScrollBarContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollBarWidth, setScrollBarWidth] = useState(0);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const scrollbarWidth = scrollContainerRef.current.offsetWidth - scrollContainerRef.current.clientWidth;
            setScrollBarWidth(scrollbarWidth);
        }
    }, []);
    const contextValue = useMemo(() => ({
        scrollBarWidth,
        setScrollBarWidth,
        scrollContainerRef,
    }), [scrollBarWidth]);


    return (
        <ScrollBarContext.Provider value={contextValue}>
            {children}
        </ScrollBarContext.Provider>
    );
};

export const useScrollBar = (): ScrollBarContextType => {
    const context = useContext(ScrollBarContext);
    if (context === undefined) {
        throw new Error('useCalendarView must be used within a ScrollBarContext Provider');
    }
    return context;
};
