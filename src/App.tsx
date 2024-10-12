import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";
import {CalendarViewProvider} from "./page/calendar/context/CalendarViewContext";
import {EventContextProvider} from "./context/EventContext";

const App = () => {

    return (
        <SidebarStateProvider>
            <EventContextProvider>
                <CalendarViewProvider>
                    <AppRouter/>
                </CalendarViewProvider>
            </EventContextProvider>
        </SidebarStateProvider>
    );
}
export default App;
