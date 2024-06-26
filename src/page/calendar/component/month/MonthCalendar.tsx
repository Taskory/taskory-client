import React from "react";
import {
    currentDate,
    currentMonth,
    currentYear,
    firstDayOfWeek,
    lastDayOfMonth
} from "../../util/CalendarUtil";
import {MonthHeader} from "./component/MonthHeader";
import {Day} from "./component/Day";

export const MonthCalendar: React.FC = () => {
    // 이벤트 데이터 (현재 월에 맞게 수정)
    const events = [
        { date: `${currentYear}-06-01`, name: 'Event Name', time: '08:00' },
        { date: `${currentYear}-06-01`, name: 'Event Name', time: '08:00' },
        { date: `${currentYear}-06-01`, name: 'Event Name', time: '08:00' },
        { date: `${currentYear}-06-01`, name: 'Event Name', time: '08:00' },
        { date: `${currentYear}-06-02`, name: 'Event Name', time: '08:00' },
        { date: `${currentYear}-06-${currentDate.getDate()}`, name: 'Today Event', time: '10:00' },
        // 필요한 만큼 더 추가
    ];

    return (
        <div>
            <MonthHeader/>
            <div className="grid grid-cols-7 gap-4 border px-4 py-4">
                {Array(firstDayOfWeek).fill(null).map((_, index) => (
                    <div key={index} className="border p-2 h-32"></div>
                ))}
                {[...Array(lastDayOfMonth.getDate())].map((_, index) => {
                    const dayEvents = events.filter((event) => {
                        const eventDate = new Date(event.date);
                        return (
                            eventDate.getFullYear() === currentYear &&
                            eventDate.getMonth() === currentMonth &&
                            eventDate.getDate() === index + 1
                        );
                    });

                    return <Day key={index} day={index + 1} events={dayEvents} />;
                })}
            </div>
        </div>
    );
};
