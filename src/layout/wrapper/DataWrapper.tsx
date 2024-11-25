import React from "react";
import {TagContextProvider} from "../../context/data/TagContext";
import {EventContextProvider} from "../../context/data/EventContext";
import {TaskContextProvider} from "../../context/data/TaskContext";

interface DataWrapperProps {
    children: React.ReactNode;
}

export const DataWrapper: React.FC<DataWrapperProps> = ({children}) => {
    return (
        <>
            <TagContextProvider>
                <EventContextProvider>
                    <TaskContextProvider>
                        {children}
                    </TaskContextProvider>
                </EventContextProvider>
            </TagContextProvider>
        </>
    );
};