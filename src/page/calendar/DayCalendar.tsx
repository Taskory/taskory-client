import React from "react";
import {useCalendar} from "./context/CalendarContext";
import {TimeLine} from "./component/TimeLine";
import {FullDayLine} from "./component/FullDayLine";
import {EventInterface} from "../../api/interface/EventInterface";

export const DayCalendar: React.FC = () => {
    const { currentDate, events } = useCalendar();

    function getEventsForDay(date: Date): EventInterface[] {
        const startOfDay: string = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
        const endOfDay: string = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();

        return events.map((event: EventInterface) => {
            let startDateTime = new Date(event.startDateTime);
            let dueDateTime = new Date(event.dueDateTime);

            if (startDateTime < new Date(startOfDay)) {
                startDateTime = new Date(startOfDay);
            }

            if (dueDateTime > new Date(endOfDay)) {
                dueDateTime = new Date(new Date(endOfDay).getTime() - 1); // Set to 23:59:59
            }

            return {
                ...event,
                startDateTime: startDateTime.toISOString(),
                dueDateTime: dueDateTime.toISOString()
            };
        }).filter((event: EventInterface) => (
            event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay
        ));
    }

    console.log("events");
    console.log(events);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                   <TimeLine />
                </div>
                {/* Day Columns */}
                <div className="w-[90%] border-l border-gray-200">
                    <FullDayLine events={getEventsForDay(currentDate)} />
                </div>
            </div>
        </div>
    );
};