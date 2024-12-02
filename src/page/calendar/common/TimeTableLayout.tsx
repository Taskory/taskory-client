import {TimeColumn} from "./TimeColumn";
import React, {ReactNode } from "react";
import {useScrollBar} from "../context/ScrollBarContext";

interface TimeTableLayoutProps {
    children: ReactNode;
}

export const TimeTableLayout: React.FC<TimeTableLayoutProps> = ({children}) => {
    const {scrollContainerRef} = useScrollBar();
    return (
        <>
            <div ref={scrollContainerRef}  // Directly use the RefObject here
                 className="flex-grow grid grid-cols-timetable overflow-y-auto">
                {/* Time column */}
                <TimeColumn/>

                {/* columns */}
                {children}
            </div>
        </>
    );
};
