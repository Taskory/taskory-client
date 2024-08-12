import {EventSummary} from "../../../api/event/eventsTypes";

export interface SplitEventsInterface {
    eventsUnder24: EventSummary[];
    eventsOver24: EventSummary[];
}