import React, {createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect} from 'react';
import {getAllEvents} from "../api/event/EventApi";
import {EventSummary} from "../api/event/EventsTypes";

interface EventContextProps {
    events: EventSummary[];
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

interface EventContextProviderProps {
    children: ReactNode;
}

export const EventContextProvider: React.FC<EventContextProviderProps> = ({ children }) => {
    const [eventSummaryList, setEventSummaryList] = useState<EventSummary[]>([]);

    const fetchEvents = useCallback(async () => {
        try {
            const response = await getAllEvents();
            setEventSummaryList(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const contextValue: EventContextProps = useMemo(() => ({
        events: eventSummaryList
    }), [eventSummaryList]);

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