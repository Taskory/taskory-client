import React, {useEffect, useState} from "react";
import {useCalendar} from "./context/CalendarContext";
import {EventInterface} from "../../api/interface/EventInterface";
import {useTestData} from "./context/TestDataContext";
import {TimeLine} from "./component/TimeLine";
import {DayLine} from "./component/DayLine";

export const DayCalendar: React.FC = () => {
    const { currentDate } = useCalendar();
    const { dummyEvents } = useTestData();
    const [events, setEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        setEvents(dummyEvents);
    }, [currentDate]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                   <TimeLine />
                </div>
                {/* Day Columns */}
                <div className="w-[90%] border-l border-gray-200">
                <DayLine events={events} />
                </div>
            </div>
        </div>
    );
};