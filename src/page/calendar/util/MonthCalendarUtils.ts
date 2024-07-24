import {EventInterface} from "../../../api/interface/EventInterface";

export function getMonthlyEvents(events: EventInterface[], date: Date): EventInterface[][] {
    // 현재 날짜를 구합니다.

    // 이번 달의 일수를 구합니다.
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // 월별 이벤트를 저장할 배열을 초기화합니다.
    const result: EventInterface[][] = Array.from({ length: daysInMonth }, () => []);

    // 각 이벤트를 월별 배열에 추가합니다.
    events.forEach(event => {
        const startDate = new Date(event.startDateTime);
        const endDate = new Date(event.dueDateTime);

        // 이벤트가 시작되는 날짜와 종료되는 날짜의 일(day)을 구합니다.
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        // 이벤트를 시작일부터 종료일까지 각 날짜에 추가합니다.
        for (let day = startDay; day <= endDay; day++) {
            result[day - 1].push(event);
        }
    });

    return result;
}
