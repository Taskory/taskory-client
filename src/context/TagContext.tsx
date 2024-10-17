import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState
} from 'react';
import {request_getAllTags} from "../api/tag/TagApi";
import {TagColor, TagResponse} from "../api/tag/TagTypes";

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
    const [userTags, setUserTags] = useState<TagResponse[]>([
        { id: 1, title: "Tag1", color: TagColor.BLACK },
        { id: 2, title: "Tag2", color: TagColor.RED },
        { id: 3, title: "Tag3", color: TagColor.BLUE },
    ]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const fetchTags: () => Promise<void> = async (): Promise<void> => {
        try {
            const response = await request_getAllTags();
            setUserTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const contextValue: TagContextProps = useMemo(() => ({
        userTags,
        setUserTags,
        selectedTagIds,
        setSelectedTagIds,
        fetchTags
    }), [selectedTagIds, userTags]);

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