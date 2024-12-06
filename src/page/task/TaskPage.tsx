import {TaskHeader} from "./component/TaskHeader";
import React from "react";
import {TaskBoard} from "./component/taskBoard/TaskBoard";

export const TaskPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col h-full">
                {/* TaskHeader Component */}
                <TaskHeader/>

                {/* Boards Section */}
                <TaskBoard />
            </div>
        </>
    );
};