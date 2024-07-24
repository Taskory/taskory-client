import {EventInterface} from "../../../api/interface/EventInterface";
import {set} from "date-fns";
import {SplitEventsInterface} from "../interface/CalendarContextInterface";

export function getSplitEvents(events: EventInterface[], firstDate: Date): SplitEventsInterface {
    let under24hours: EventInterface[] = [];
    let over24hours: EventInterface[] = [];
    const oneDayMilliSeconds = (24 * 60 * 60 * 1000);
    events.forEach((event: EventInterface) => {
        const eventStart: Date = new Date(event.startDateTime);
        const eventEnd: Date = new Date(event.dueDateTime);


        // events over 24 hours
        if (eventEnd.getTime() - eventStart.getTime() >=  oneDayMilliSeconds) {
            over24hours.push(event);
        }
        // events under 24hours - start date <= previous month
        else if (new Date(event.startDateTime) < firstDate) {
            event.startDateTime = firstDate.toISOString();
            under24hours.push(event);
        }
        // events under 24hours
        else {
            const dueDate: Date = new Date(event.dueDateTime);
            const startDate: Date = new Date(event.startDateTime);
            // under 24 hours and cross 2day
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

