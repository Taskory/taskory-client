import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction, useCallback,
    useContext, useEffect,
    useMemo,
    useState
} from 'react';
import {request_getAllTags} from "../api/tag/TagApi";
import {TagResponse} from "../api/tag/TagTypes";

interface TagContextProps {
    userTags: TagResponse[];
    setUserTags: Dispatch<SetStateAction<TagResponse[]>>;
    selectedTagIds: number[];
    setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
    fetchTags: () => Promise<void>;
}

const TagContext = createContext<TagContextProps | undefined>(undefined);

interface TagContextProviderProps {
    children: ReactNode;
}

export const TagContextProvider: React.FC<TagContextProviderProps> = ({ children }) => {
    const [userTags, setUserTags] = useState<TagResponse[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const fetchTags = useCallback(async () => {
        try {
            const response = await request_getAllTags();
            setUserTags(response.data);
            const ids = response.data.map((tag: TagResponse) => tag.id); // Extract all tag IDs
            setSelectedTagIds(ids); // Set the IDs in selectedTagIds
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const contextValue: TagContextProps = useMemo(() => ({
        userTags,
        setUserTags,
        selectedTagIds,
        setSelectedTagIds,
        fetchTags
    }), [fetchTags, selectedTagIds, userTags]);

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