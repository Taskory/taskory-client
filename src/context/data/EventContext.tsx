import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {DateEventInfo, EventSummary} from '../../api/event/EventsTypes';
import { request_getAllEvents } from '../../api/event/EventApi';

interface EventContextProps {
    originEvents: EventSummary[];
    fetchOriginEvents: () => void;
    selectedDateEventInfo: DateEventInfo;
    handleSelectDate: (dateEventInfo: DateEventInfo) => void;
    initSelectedDateEventInfo: () => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

interface EventContextProviderProps {
    children: ReactNode;
}

export const EventContextProvider: React.FC<EventContextProviderProps> = ({ children }) => {
    const [originEvents, setOriginEvents] = useState<EventSummary[]>([]);
    const [selectedDateEventInfo, setSelectedDateEventInfo] = useState<DateEventInfo>({date: null, events: []});

    const initSelectedDateEventInfo = () => {
        setSelectedDateEventInfo({date: null, events: []});
    }

    const handleSelectDate = useCallback((dateEventInfo: DateEventInfo) => {
        setSelectedDateEventInfo(dateEventInfo);
    }, [setSelectedDateEventInfo]);

    const fetchOriginEvents = useCallback(async () => {
        try {
            const res = await request_getAllEvents();
            if (res) {
                setOriginEvents(res.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, []);

    useEffect(() => {
        fetchOriginEvents();
    }, [fetchOriginEvents]);

    const contextValue: EventContextProps = useMemo(
        () => ({
            originEvents,
            fetchOriginEvents,
            selectedDateEventInfo,
            handleSelectDate,
            initSelectedDateEventInfo,
        }),
        [fetchOriginEvents, handleSelectDate, originEvents, selectedDateEventInfo]
    );

    return (
        <EventContext.Provider value={contextValue}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = (): EventContextProps => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within an EventContextProvider');
    }
    return context;
};
