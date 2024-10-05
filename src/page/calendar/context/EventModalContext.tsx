import React, {createContext, useContext, useMemo, ReactNode, useState} from 'react';
import EventModal from "../EventModal";

interface EventModalContextType {
    openEventModal: (eventId?: number) => void;
    closeEventModal: () => void;
    selectedEventId: number | null;
    isModalOpen: boolean;
}

const EventModalContext = createContext<EventModalContextType | undefined>(undefined);


// Modify CalendarProvider to include refetchEvents
export const EventModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeEventModal = () => {
        setIsModalOpen(false);
        setSelectedEventId(null);
    };

    const openEventModal = (eventId?: number) => {
        if (eventId) {
            setSelectedEventId(eventId);
        }
        setIsModalOpen(true);
    };

    const contextValue: EventModalContextType = useMemo(() => ({
        openEventModal,
        selectedEventId,
        isModalOpen,
        closeEventModal
    }), [isModalOpen, selectedEventId]);

    return (
        <EventModalContext.Provider value={contextValue}>
            {children}
            {isModalOpen && (
                <EventModal/>
            )}
        </EventModalContext.Provider>
    );
};

// Hook to access the calendar context
export const useEventModal = (): EventModalContextType => {
    const context = useContext(EventModalContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
