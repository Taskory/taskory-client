import {EventInterface} from "../../../../api/interface/EventInterface";

export interface WeekInfoInterface {
    startSunday: Date;
}

export interface DayColumnProps {
    events?: EventInterface[];
}

export interface StylesForEachEventInterface {
    title: string;
    top: string;
    bottom: string;
    left: string;
    color: string;
}
