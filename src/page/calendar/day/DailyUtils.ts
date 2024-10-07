import {EventSummary} from "../../../api/event/EventsTypes";

export function getEventsForDate(events: EventSummary[], date: Date): EventSummary[] {
    const result: EventSummary[] = [];

    // Normalize the input date to ignore the time part
    const inputDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    events.forEach((event: EventSummary) => {
        const eventStartDate: Date = new Date(event.startDateTime);
        const eventDueDate: Date = new Date(event.dueDateTime);

        // Normalize event start and due dates to ignore the time part
        const normalizedStartDate: Date = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
        const normalizedDueDate: Date = new Date(eventDueDate.getFullYear(), eventDueDate.getMonth(), eventDueDate.getDate());

        // Check if the input date is within the event's start and due date range (inclusive)
        if (
            normalizedStartDate <= inputDate &&
            normalizedDueDate >= inputDate
        ) {
            result.push(event);
        }
    });

    return result;
}