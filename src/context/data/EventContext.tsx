import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {EventSummary} from "../../api/event/EventsTypes";
import {request_getAllEvents} from "../../api/event/EventApi";

interface EventContextProps {
    originEvents: EventSummary[];
    fetchOriginEvents: () => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

interface EventContextProviderProps {
    children: ReactNode;
}

export const EventContextProvider: React.FC<EventContextProviderProps> = ({ children }) => {
    const [originEvents, setOriginEvents] = useState<EventSummary[]>([]);
    const fetchOriginEvents = useCallback(async () => {
        try {
            request_getAllEvents().then((res) => {
                if (res) {
                    setOriginEvents(res.data);
                }
            })

        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, []);

    useEffect(() => {
        fetchOriginEvents();
    }, [fetchOriginEvents]);

    const contextValue: EventContextProps = useMemo(() => ({
        originEvents,
        fetchOriginEvents
    }), [originEvents]);

    return (
        <EventContext.Provider value={contextValue}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = (): EventContextProps => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useTaskContext must be used within an TaskContextProvider');
    }
    return context;
};