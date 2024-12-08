import React from "react";
import {TaskDragDropProvider} from "../../context/TaskDragDropContext";
import {HorizonBoard} from "./board/HorizonBoard";
import {TaskStatus} from "../../../../api/task/TaskTypes";
import {VerticalBoard} from "./board/VerticalBoard";

export const TaskBoard: React.FC = () => {
    return (
        <TaskDragDropProvider>
            <div className="p-2 w-full h-full overflow-y-scroll space-y-2">
                <div className="flex flex-col gap-2 w-full h-full">
                    <div className="flex gap-2 h-1/2">
                        <VerticalBoard taskStatus={TaskStatus.TODO}/>
                        <VerticalBoard taskStatus={TaskStatus.PROGRESS}/>
                    </div>
                    <div className="flex flex-col gap-2 ">
                        <HorizonBoard taskStatus={TaskStatus.BACKLOG} />
                        <HorizonBoard taskStatus={TaskStatus.DONE} />
                    </div>
                </div>
            </div>
        </TaskDragDropProvider>
    );
};
