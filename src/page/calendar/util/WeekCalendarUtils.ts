import {EventInterface} from "../../../api/interface/EventInterface";
import {StylesForEachEventInterface, WeekInfoInterface} from "../interface/WeekCalendarInterfaces";

function calculateHeightRange( event : EventInterface) {
    const startingTime: Date = new Date(event.startDateTime);
    const endingTime: Date = new Date(event.dueDateTime);
    const topHeight: string = `${((startingTime.getHours() + startingTime.getMinutes() / 60) / 24) * 100}`;
    const bottomHeight: string = `${((endingTime.getHours() + endingTime.getMinutes() / 60) / 24) * 100}`;
    return {topHeight, bottomHeight}
}

function sortEvents(events: EventInterface[]) {
    let sortedEvents: EventInterface[] = [...events]
    for (let i = 0; i < sortedEvents.length ; i++) {
        for (let j = 0; j < sortedEvents.length ; j++) {
            if (i < j) {
                const startingHourA: number = new Date(sortedEvents[i].startDateTime).getHours();
                const startingMinA: number = new Date(sortedEvents[i].startDateTime).getMinutes();
                const startingHourB: number = new Date(sortedEvents[j].startDateTime).getHours();
                const startingMinB: number = new Date(sortedEvents[j].startDateTime).getMinutes();
                if (startingHourA > startingHourB || (startingHourA === startingHourB && startingMinA > startingMinB)) {
                    const temp: EventInterface = sortedEvents[i];
                    sortedEvents[i] = sortedEvents[j];
                    sortedEvents[j] = temp;
                }
            }
        }
    }
    for (let i = 0; i < sortedEvents.length - 1; i++) {
        if (sortedEvents[i].startDateTime === sortedEvents[i+1].startDateTime) {
            const endingHourA: number = new Date(sortedEvents[i].dueDateTime).getHours();
            const endingMinA: number = new Date(sortedEvents[i].dueDateTime).getMinutes();
            const endingHourB: number = new Date(sortedEvents[i + 1].dueDateTime).getHours();
            const endingMinB: number = new Date(sortedEvents[i + 1].dueDateTime).getMinutes();
            if (endingHourA < endingHourB || (endingHourA === endingHourB && endingMinA < endingMinB)) {
                const temp: EventInterface = sortedEvents[i];
                sortedEvents[i] = sortedEvents[i + 1];
                sortedEvents[i + 1] = temp;
            }
        }
    }
    return sortedEvents;
}

function updateWidthStyles(events: StylesForEachEventInterface[]) {
    let updatedEvents: StylesForEachEventInterface[] = [...events];
    for (let i = 0; i < updatedEvents.length; i++) {
        const eventA: StylesForEachEventInterface = updatedEvents[i];
        for (let j = 0; j < updatedEvents.length; j++) {
            if (i < j) {
                const eventB: StylesForEachEventInterface = updatedEvents[j];
                if (
                    (parseFloat(eventA.top) < parseFloat(eventB.bottom) &&
                        parseFloat(eventA.bottom) > parseFloat(eventB.top))
                ) {
                    // console.log('add left')
                    updatedEvents[j].left = `${parseFloat(eventB.left) + 10}`;
                }
            }
        }
    }
    return updatedEvents;
}


export function processEventPosition(events: EventInterface[]): StylesForEachEventInterface[] {
    const sortedEvents: EventInterface[] = sortEvents(events);
    let stylesForEachEvent: StylesForEachEventInterface[] = [];

    sortedEvents.forEach((event: EventInterface) => {
        const {topHeight, bottomHeight}: { topHeight: string; bottomHeight: string; } = calculateHeightRange(event);
        stylesForEachEvent.push({
            title: event.title,
            top: topHeight,
            bottom: bottomHeight,
            left: "0", // initial value
            color: event.tag.color.toLowerCase()
        })
    });

    return updateWidthStyles(stylesForEachEvent)
}

export const initializeWeekInfo = (date: Date): WeekInfoInterface => ({
    startSunday: new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()),
});

export function getEventDayIndex(eventStart: Date, startingTimeOfWeek: Date): number {
    let dayIndex = Math.floor((eventStart.getTime() - startingTimeOfWeek.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(dayIndex, 6)); // Ensure index is within bounds of the week
}

export function getWeeklyEvents(events: EventInterface[], startSunday: Date): EventInterface[] {
    const result: EventInterface[] = [];
    const endSaturday = new Date(startSunday);
    endSaturday.setDate(startSunday.getDate() + 6);

    events.forEach((event: EventInterface) => {
        const eventStartDateTime = new Date(event.startDateTime);
        if (eventStartDateTime >= startSunday && eventStartDateTime <= endSaturday) {
            result.push(event);
        }
    });

    return result;
}
