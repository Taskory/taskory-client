import {EventSummary} from "../../../api/event/eventsTypes";

export interface WeekInfoInterface {
    startSunday: Date;
}

export interface DayColumnProps {
    under24hoursEvents: EventSummary[];
    over24hoursEvents: EventSummary[];
}

export interface StylesForEachEventInterface {
    title: string;
    top: string;
    bottom: string;
    left: string;
    color: string;
}