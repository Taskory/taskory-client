import React, {createContext, ReactNode, useContext, useMemo, useState} from 'react';
import {getAllTags} from "../api/tag/TagApi";
import {TagResponse} from "../api/tag/TagTypes";

interface TagContextProps {
    tags: TagResponse[];
    fetchTags: () => Promise<void>;
}

const TagContext = createContext<TagContextProps | undefined>(undefined);

interface TagContextProviderProps {
    children: ReactNode;
}

export const TagContextProvider: React.FC<TagContextProviderProps> = ({ children }) => {
    const [tags, setTags] = useState<TagResponse[]>([]);


    const fetchTags: () => Promise<void> = async (): Promise<void> => {
        try {
            const response = await getAllTags();
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const contextValue: TagContextProps = useMemo(() => ({
        tags,
        fetchTags
    }), [tags]);

    return (
        <TagContext.Provider value={contextValue}>
            {children}
        </TagContext.Provider>
    );
};

export const useTagContext = (): TagContextProps => {
    const context = useContext(TagContext);
    if (!context) {
        throw new Error('useTagContext must be used within an TaskContextProvider');
    }
    return context;
};