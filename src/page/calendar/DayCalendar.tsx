import React, {useState} from "react";
import {useCalendar} from "./context/CalendarContext";
import {TimeLine} from "./component/TimeLine";
import {DayLine} from "./component/DayLine";
import {EventInterface} from "../../api/interface/EventInterface";

export const DayCalendar: React.FC = () => {
    const { events } = useCalendar();

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-grow h-full overflow-y-scroll">
                <div className="w-[10%]">
                   <TimeLine />
                </div>
                {/* Day Columns */}
                <div className="w-[90%] border-l border-gray-200">
                {/*<DayLine events={events} />*/}
                </div>
            </div>
        </div>
    );
};