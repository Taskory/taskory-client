import {EventInterface} from "../../../api/interface/EventInterface";

export interface SplitEventsInterface {
    eventsUnder24: EventInterface[];
    eventsOver24: EventInterface[];
}