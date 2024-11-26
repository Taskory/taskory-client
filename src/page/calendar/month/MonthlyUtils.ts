import {EventSummary} from "../../../api/event/EventsTypes";

export function splitEventsPerDay(events: EventSummary[], date: Date): EventSummary[][] {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const result: EventSummary[][] = Array.from({ length: daysInMonth }, () => []);

    events.forEach(event => {
        const startDate = new Date(event.startDateTime);
        const endDate = new Date(event.dueDateTime);
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        for (let day = startDay; day <= endDay; day++) {
            result[day - 1].push(event);
        }
    });

    return result;
}
