import {TaskHeader} from "./component/TaskHeader";
import {TaskBoard} from "./component/TaskBoard";
import {TaskStatus} from "../../api/task/TaskTypes";
import React from "react";
import {TaskWrapper} from "./TaskWrapper";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const TaskPage: React.FC = () => {
    return (
        <TaskWrapper>
            <div className="flex flex-col h-full">
                {/* TaskHeader Component */}
                <TaskHeader/>

                {/* Boards Section */}
                <div className="flex gap-2 p-2">
                    <DndProvider backend={HTML5Backend}>
                        {/* Filter tasks into boards based on their status */}
                        <TaskBoard taskStatus={TaskStatus.TO_DO}/>
                        <TaskBoard taskStatus={TaskStatus.IN_PROGRESS}/>
                        <TaskBoard taskStatus={TaskStatus.DONE}/>
                    </DndProvider>
                </div>
            </div>
        </TaskWrapper>
    );
};