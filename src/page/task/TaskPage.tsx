import {TaskHeader} from "./component/TaskHeader";
import {TaskBoard} from "./component/TaskBoard";
import {TaskStatus} from "../../api/task/TaskTypes";
import React from "react";
import {TaskWrapper} from "./TaskWrapper";

export const TaskPage: React.FC = () => {
    return (
        <TaskWrapper>
            <div className="flex flex-col h-full">
                {/* TaskHeader Component */}
                <TaskHeader/>

                {/* Boards Section */}
                <div className="flex gap-2 p-2">
                    {/* Filter tasks into boards based on their status */}
                    <TaskBoard taskStatus={TaskStatus.TO_DO}/>
                    <TaskBoard taskStatus={TaskStatus.IN_PROGRESS}/>
                    <TaskBoard taskStatus={TaskStatus.DONE}/>
                </div>
            </div>
        </TaskWrapper>
    );
};