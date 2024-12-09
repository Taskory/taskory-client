import React from "react";
import { TaskDragDropProvider } from "../../context/TaskDragDropContext";
import { HorizonBoard } from "./board/HorizonBoard";
import { TaskStatus } from "../../../../api/task/TaskTypes";
import { VerticalBoard } from "./board/VerticalBoard";

export const TaskBoard: React.FC = () => {
    return (
        <TaskDragDropProvider>
            <div className="h-full overflow-y-auto">
                {/* Top container: Vertical Boards */}
                <div className="flex gap-2 p-2 min-h-[50%]">
                    <div className="flex-1 flex items-stretch">
                        <VerticalBoard taskStatus={TaskStatus.TODO}/>
                    </div>
                    <div className="flex-[2] flex items-stretch ">
                        <VerticalBoard taskStatus={TaskStatus.PROGRESS}/>
                    </div>
                </div>

                {/* Bottom container: Horizon Boards */}
                <div className="grid gap-2 p-2">
                    <HorizonBoard taskStatus={TaskStatus.BACKLOG}/>
                    <HorizonBoard taskStatus={TaskStatus.DONE}/>
                </div>

                {/* Footer Blank*/}
                <div className="h-20"/>
            </div>

        </TaskDragDropProvider>
    );
};