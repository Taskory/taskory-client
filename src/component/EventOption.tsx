import React from "react";
import {EventSummary} from "../api/event/EventsTypes";
import {getTagStringColor} from "../util/TagUtil";
import {TagBadge} from "./TagBadge";

export const EventOption: React.FC<{ event: EventSummary }> = ({event}) => {
    const getDisplayDate = (startDateTime: string, dueDateTime: string): string => {
        const startDate = new Date(startDateTime);
        const dueDate = new Date(dueDateTime);

        const formatDate = (date: Date): string => {
            const yy = date.getFullYear().toString().slice(2); // 연도 두 자리
            const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
            const dd = String(date.getDate()).padStart(2, "0"); // 일
            return `${yy}.${mm}.${dd}`;
        };

        const startFormatted = formatDate(startDate);
        const dueFormatted = formatDate(dueDate);

        if (startFormatted === dueFormatted) {
            return startFormatted;
        } else {
            return `${startFormatted}~${dueFormatted}`;
        }
    };

    return (
        <div className="grid grid-cols-2 items-center h-7 w-full">
            <div className={`${getTagStringColor(event.tag.color)} flex items-center gap-2`}>
                <TagBadge tagColor={event.tag.color} tagTitle={event.tag.title}/>
                <p className="overflow-hidden truncate">{event.title}</p>
            </div>
            <div className="flex justify-end">
                {getDisplayDate(event.startDateTime, event.dueDateTime)}
            </div>
        </div>
    );
}

