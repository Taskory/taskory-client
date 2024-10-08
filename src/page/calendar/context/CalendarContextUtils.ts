import {set} from "date-fns";
import {SplitEventsInterface} from "./CalendarContextInterface";
import {EventSummary} from "../api/event/EventsTypes";
import {TimeUtil} from "../util/TimeUtil";

export function getProcessedEvents(events: EventSummary[], firstDate: Date): SplitEventsInterface {
    let under24hours: EventSummary[] = [];
    let over24hours: EventSummary[] = [];
    const oneDayMilliSeconds = (24 * 60 * 60 * 1000);

    events.forEach((event: EventSummary) => {
        const eventStart: Date = TimeUtil.stringToDate(event.startDateTime);
        const eventEnd: Date = TimeUtil.stringToDate(event.dueDateTime);

        // events over 24 hours
        if (eventEnd.getTime() - eventStart.getTime() >=  oneDayMilliSeconds) {
            over24hours.push(event);
        }
        // events under 24hours - start date <= previous month
        else if (eventStart < firstDate) {
            under24hours.push({
                ...event,
                startDateTime: firstDate.toISOString(),
            });
        }
        // events under 24hours
        else {
            const dueDate: Date = TimeUtil.stringToDate(event.dueDateTime);
            const startDate: Date = TimeUtil.stringToDate(event.startDateTime);

            // under 24 hours and cross 2 days
            if (new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime() - new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime() >= oneDayMilliSeconds) {
                under24hours.push({
                    ...event,
                    startDateTime: startDate.toISOString(),
                    dueDateTime: set(startDate, {hours: 23, minutes: 59, seconds: 59}).toISOString()
                });
                under24hours.push({
                    ...event,
                    startDateTime: set(dueDate, {hours: 0, minutes: 0, seconds: 0}).toISOString(),
                    dueDateTime: dueDate.toISOString(),
                });
            }
            // under 24hours only 1day
            else {
                under24hours.push(event);
            }
        }
    });

    return {eventsUnder24: under24hours, eventsOver24: over24hours};
}
