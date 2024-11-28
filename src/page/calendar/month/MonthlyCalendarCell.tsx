import React from 'react';
import { EventSummary } from "../../../api/event/EventsTypes";
import { useEventModal } from "../context/EventModalContext";

interface MonthCalendarCellProps {
    day: number;
    events?: EventSummary[];
    isCurrentMonth: boolean;
}

export const MonthlyCalendarCell: React.FC<MonthCalendarCellProps> = ({ day, events = [], isCurrentMonth }) => {
    const { openEventModal } = useEventModal();

    const handleOpenModal = (id: number) => {
        if (id) {
            openEventModal(id);
        }
    };

    const handleShowAllEvents = () => {
        // 나머지 이벤트를 보여줄 수 있는 모달을 열거나 처리
        console.log("Show all events for the day");
    };

    const visibleEvents = events.slice(0, 3); // 최대 3개의 이벤트만 표시
    const moreEventCount = events.length - visibleEvents.length;

    return (
        <div
            className={`border-b border-r h-full overflow-hidden relative flex flex-col ${
                isCurrentMonth ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-200'
            } transition-colors duration-150 ease-in-out`}
        >
            <div className="text-left ml-2 mt-1">{day}</div>
            <div className={`overflow-hidden flex flex-col mb-1 h-full`}>
                {visibleEvents.map((event, idx) => {
                    const textColor = `text-${event.tagColor.toLowerCase()}-500`;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleOpenModal(event.id)}
                            className={`flex justify-between whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-transform duration-150 ease-in-out rounded-md`}
                        >
                            <span className={`text-sm px-1 font-semibold ${textColor}`}>
                                ●{event.title}
                            </span>
                        </button>
                    );
                })}
                {moreEventCount > 0 && (
                    <button
                        onClick={handleShowAllEvents}
                        className="text-sm text-gray-500 mt-1"
                    >
                        +{moreEventCount} more
                    </button>
                )}
            </div>
        </div>
    );
};
