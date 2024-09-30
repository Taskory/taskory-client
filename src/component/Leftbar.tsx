import { SelectItem } from "./SelectItem";
import React from "react";
import {useSidebarStateContext} from "../context/SidebarStateContext";

export const Leftbar: React.FC = () => {
    const { isLeftbarOpened } = useSidebarStateContext();
    return (
        <div
            className={`border-r transition-all duration-300 ${
                isLeftbarOpened ? "w-64" : "w-16"
            } flex flex-col`}
        >
            {/* 상단 아이템들 */}
            <div className="mt-4 flex-1">
                <SelectItem
                    src={"/asset/img/leftbar/dashboard.svg"}
                    label="Dashboard"
                    path="/dashboard"
                    isOpen={isLeftbarOpened}
                />
                <SelectItem
                    src={"/asset/img/leftbar/report.svg"}
                    label="Report"
                    path="/report"
                    isOpen={isLeftbarOpened}
                />
                <SelectItem
                    src={"/asset/img/leftbar/calendar.svg"}
                    label="Calendar"
                    path="/calendar"
                    isOpen={isLeftbarOpened}
                />
                <SelectItem
                    src={"/asset/img/leftbar/task.svg"}
                    label="Task"
                    path="/task"
                    isOpen={isLeftbarOpened}
                />
                <SelectItem
                    src={"/asset/img/leftbar/routine.svg"}
                    label="Routine"
                    path="/routine"
                    isOpen={isLeftbarOpened}
                />
            </div>

            {/* 하단 아이템 */}
            <div className="mb-4">
                <SelectItem
                    src={"/asset/img/leftbar/setting.svg"}
                    label="Setting"
                    path="/setting"
                    isOpen={isLeftbarOpened}
                />
            </div>
        </div>
    );
};
