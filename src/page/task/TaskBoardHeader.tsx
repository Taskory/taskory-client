import React from "react";
import {useTaskModal} from "./TaskModalContext";

export const TaskBoardHeader: React.FC<{ title: string }> = ({ title }) => {
    const {openTaskModal} = useTaskModal();
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={() => openTaskModal()}>+</button>
        </div>
    );
};