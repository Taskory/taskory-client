import React from "react";
import { useSidebarStateContext } from "../context/SidebarStateContext";

export const RightBar: React.FC = () => {
    const { isRightbarOpened, toggleRightbar } = useSidebarStateContext();

    return (
        <aside className="flex">
            <div className="btn btn-sm mt-10" onClick={toggleRightbar}>
                <img src="/asset/img/rightbar/open-close-button.svg" alt="RightBarBtn"
                     className={`h-8 w-8 transform ${isRightbarOpened ? `` : `rotate-180`}`}/>
            </div>
            <div className={`border transition-all duration-500 ease-in-out ${isRightbarOpened ? 'w-0' : 'w-64'}`}>
                <div className="p-4">
                    ???
                </div>
            </div>
        </aside>
    );
};
