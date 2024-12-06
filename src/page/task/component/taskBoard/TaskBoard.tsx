import React from "react";
import {BacklogBoard} from "./board/BacklogBoard";
import {TodoBoard} from "./board/TodoBoard";
import {ProgressBoard} from "./board/ProgressBoard";
import {DoneBoard} from "./board/DoneBoard";
import {TaskDragDropProvider} from "../../context/TaskDragDropContext";

export const TaskBoard: React.FC = () => {
    return (
        <div className="p-2 space-y-2">
            <TaskDragDropProvider>
                <BacklogBoard/>
                <TodoBoard/>
                <ProgressBoard/>
                <DoneBoard/>
            </TaskDragDropProvider>
        </div>
    );
};
