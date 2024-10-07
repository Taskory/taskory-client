import React from "react";
import { StylesForEachEventInterface } from "../week/WeeklyInterface";
import { useEventModal } from "../context/EventModalContext";

export const EventBlock: React.FC<StylesForEachEventInterface> = ({ top, bottom, left, color, title, id }) => {
    const { openEventModal } = useEventModal();
    const height = `${(+bottom) - (+top)}`;
    const width = `${100 - (+left)}`;

    const handleOpenEventModal = () => {
        openEventModal(id);
    };

    return (
        <div
            className={`absolute bg-${color}-100 flex flex-grow cursor-pointer hover:bg-${color}-200 hover:shadow-lg transition-all duration-300`}
            style={{ top: `${top}%`, height: `${height}%`, left: `${left}%`, width: `${width}%` }}
            onClick={handleOpenEventModal}
        >
            <div className={`min-w-[3px] max-w-[5px] bg-${color}-400 hover:bg-${color}-600 transition-all duration-300`} />
            <div className="p-2 text-xs font-semibold">{title}</div>
        </div>
    );
}
