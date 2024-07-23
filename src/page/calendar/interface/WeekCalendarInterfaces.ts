import {EventInterface} from "../../../api/interface/EventInterface";

export interface WeekInfoInterface {
    startSunday: Date;
}

export interface DayColumnProps {
    under24hoursEvents: EventInterface[];
    over24hoursEvents: EventInterface[];
}

export interface StylesForEachEventInterface {
    title: string;
    top: string;
    bottom: string;
    left: string;
    color: string;
}
