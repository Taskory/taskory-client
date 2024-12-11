import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { DateEventInfo, EventSummary } from '../../api/event/EventsTypes';
import { request_getEventsByTags } from '../../api/event/EventApi';
import { useTagContext } from './TagContext';
import { useSidebarStateContext } from '../SidebarStateContext';

interface EventContextProps {
    originEvents: EventSummary[];
    fetchOriginEvents: () => Promise<void>;
    selectedDateEventInfo: DateEventInfo;
    handleSelectDate: (dateEventInfo: DateEventInfo) => void;
    initSelectedDateEventInfo: () => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

interface EventContextProviderProps {
    children: ReactNode;
}

export const EventContextProvider: React.FC<EventContextProviderProps> = ({ children }) => {
    const { selectedTagIds } = useTagContext();
    const { isRightbarOpened, toggleRightbar } = useSidebarStateContext();
    const [originEvents, setOriginEvents] = useState<EventSummary[]>([]);
    const [selectedDateEventInfo, setSelectedDateEventInfo] = useState<DateEventInfo>({
        date: null,
        events: [],
    });

    // Reset selectedDateEventInfo to its initial state
    const initSelectedDateEventInfo = useCallback(() => {
        setSelectedDateEventInfo({ date: null, events: [] });
    }, []);

    // Update selectedDateEventInfo and ensure rightbar is toggled open if not already
    const handleSelectDate = useCallback(
        (dateEventInfo: DateEventInfo) => {
            // Avoid unnecessary state updates if the new state is the same as the current state
            if (
                selectedDateEventInfo.date !== dateEventInfo.date ||
                selectedDateEventInfo.events !== dateEventInfo.events
            ) {
                setSelectedDateEventInfo(dateEventInfo);
            }
            if (!isRightbarOpened) {
                toggleRightbar();
            }
        },
        [isRightbarOpened, toggleRightbar, selectedDateEventInfo]
    );

    // Fetch events by tags and only update state if data has changed
    const fetchOriginEvents = useCallback(async () => {
        try {
            const events = await request_getEventsByTags(selectedTagIds);
            // Compare new events with the current state to avoid redundant updates
            setOriginEvents((prevEvents) =>
                JSON.stringify(prevEvents) !== JSON.stringify(events) ? events : prevEvents
            );
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, [selectedTagIds]);

    // Fetch events when dependencies change
    useEffect(() => {
        fetchOriginEvents();
    }, [fetchOriginEvents]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            originEvents,
            fetchOriginEvents,
            selectedDateEventInfo,
            handleSelectDate,
            initSelectedDateEventInfo,
        }),
        [originEvents, fetchOriginEvents, selectedDateEventInfo, handleSelectDate, initSelectedDateEventInfo]
    );

    return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>;
};

// Ensure context is used only within its provider
export const useEventContext = (): EventContextProps => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within an EventContextProvider');
    }
    return context;
};
