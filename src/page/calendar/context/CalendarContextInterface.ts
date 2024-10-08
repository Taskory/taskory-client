import {EventSummary} from "../api/event/EventsTypes";

export interface SplitEventsInterface {
    eventsUnder24: EventSummary[];
    eventsOver24: EventSummary[];
}