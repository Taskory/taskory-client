import React, {useEffect, useRef} from 'react';
import {DateInfo, EventSummary} from "../../../api/event/EventsTypes";
import { useEventModal } from "../../../modal/context/EventModalContext";
import { useEventContext } from "../../../context/data/EventContext";
import {isEqual} from "lodash";
import {TimeUtil} from "../../../util/TimeUtil";

interface MonthCalendarCellProps {
    day: number;
    events?: EventSummary[];
    isCurrentMonth: boolean;
    date: DateInfo
}

export const MonthlyCalendarCell: React.FC<MonthCalendarCellProps> = ({day, events = [], isCurrentMonth, date}) => {
    /* Context */
    const {openEventModal} = useEventModal();
    const {handleSelectDate} = useEventContext();

    /* Functions */
    const handleOpenModal = (id: number) => {
        if (id) {
            openEventModal(id);
        }
    };

    /* Variables */
    const visibleEvents = events.slice(0, 3); // 최대 3개의 이벤트만 표시
    const moreEventCount = events.length - visibleEvents.length;

    const previousEventsRef = useRef(events);


    /* useEffect */
    useEffect(() => {
        if (date && !isEqual(previousEventsRef.current, events)) {
            previousEventsRef.current = events;
            handleSelectDate({ date, events });
        }
    }, [date, events, handleSelectDate]);

    return (
        <div
            className={`border-b border-r h-full overflow-hidden relative flex flex-col ${
                isCurrentMonth ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-200'
            } transition-colors duration-150 ease-in-out`}
            onClick={() => handleSelectDate({date, events})}
        >
            <div className="text-left ml-2 mt-1">{day}</div>
            <div className={`overflow-hidden flex flex-col mb-1 h-full`}>
                {visibleEvents.map((event, idx) => {
                    const textColor = `text-${event.tag.color.toLowerCase() as string}-500`;
                    const time = TimeUtil.calculateTimeDisplay(
                        TimeUtil.stringToDateTime(event.startDateTime),
                        TimeUtil.stringToDateTime(event.dueDateTime),
                        new Date(date.year, date.month - 1, date.day)
                    )
                    return (
                        <button
                            key={idx}
                            onClick={() => handleOpenModal(event.id)}
                            className={`flex justify-between whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-transform duration-150 ease-in-out rounded-md`}
                        >
                            <p className={`text-sm px-1 font-semibold ${textColor}`}>
                                ●{event.title}
                            </p>
                            <p className="text-xs text-gray-600">{time}</p>
                        </button>
                    );
                })}
                {moreEventCount > 0 && (
                    <button
                        className="text-sm text-gray-500 mt-1"
                    >
                        +{moreEventCount} more
                    </button>
                )}
            </div>
        </div>
    );
};
