import {EventInterface} from "../../../api/interface/EventInterface";
import {add, set} from "date-fns";
import {StylesForEachEventInterface} from "../interface/WeekCalendarInterfaces";

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


export function processEventPosition(events: EventInterface[]): { styledEvents: StylesForEachEventInterface[]; allDayEvents: EventInterface[]; } {
    const sortedEvents: EventInterface[] = sortEvents(events);
    let stylesForEachEvent: StylesForEachEventInterface[] = [];
    let allDayEvents: EventInterface[] = [];

    sortedEvents.forEach((event: EventInterface) => {
        if (new Date(event.dueDateTime).getTime() - new Date(event.startDateTime).getTime() === 86399000) {
            allDayEvents.push(event);
        } else {
            const {topHeight, bottomHeight}: { topHeight: string; bottomHeight: string; } = calculateHeightRange(event);
            stylesForEachEvent.push({
                title: event.title,
                top: topHeight,
                bottom: bottomHeight,
                left: "0", // initial value
                color: event.tag.color.toLowerCase()
            })
        }
    })

    const styledEvents: StylesForEachEventInterface[] = updateWidthStyles(stylesForEachEvent);

    return {styledEvents, allDayEvents}
}

export function splitEvents(events: EventInterface[], startSunday: Date): EventInterface[] {
    let result: EventInterface[] = [];
    events.forEach((event: EventInterface) => {
        // 시작 시간이 현재 주의 일요일 이전이라면 일요일로 설정
        if (new Date(event.startDateTime) < startSunday) {
            event.startDateTime = startSunday.toISOString();
        }

        let present00: Date = set(new Date(event.startDateTime), { hours: 0, minutes: 0, seconds: 0 });
        let present24: Date = set(new Date(event.startDateTime), { hours: 23, minutes: 59, seconds: 59 });

        // 이벤트가 하루 안에 끝나는 경우
        if (present24 >= new Date(event.dueDateTime)) {
            result.push({
                ...event,
                startDateTime: event.startDateTime,
                dueDateTime: event.dueDateTime
            });
        } else {
            // 이벤트가 여러 날에 걸쳐 있는 경우
            while (present24 < new Date(event.dueDateTime)) {
                if (present00 <= new Date(event.startDateTime)) {
                    result.push({
                        ...event,
                        startDateTime: event.startDateTime,
                        dueDateTime: present24.toISOString()
                    });
                } else {
                    result.push({
                        ...event,
                        startDateTime: present00.toISOString(),
                        dueDateTime: present24.toISOString()
                    });
                }
                present00 = add(present00, { days: 1 });
                present24 = add(present24, { days: 1});
            }
            // 마지막 부분을 처리
            result.push({
                ...event,
                startDateTime: present00.toISOString(),
                dueDateTime: event.dueDateTime
            });
        }
    });
    return result;
}
