import {TaskHeader} from "./TaskHeader";
import React from "react";
import {TaskContents} from "./TaskContents";

export const TaskPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col h-full">
                {/* TaskHeader Component */}
                <TaskHeader/>

                {/* Boards Section */}
                <TaskContents />
            </div>
        </>
    );
};