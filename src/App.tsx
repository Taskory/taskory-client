import React, {useEffect} from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";
import {CalendarViewProvider} from "./page/calendar/context/CalendarViewContext";

const App = () => {
    useEffect(() => {
        // Drag prevention event handler
        const preventDefault = (e: Event) => {
            e.preventDefault();
        };

        // Register drag prevention event listeners
        window.addEventListener('dragstart', preventDefault);
        window.addEventListener('drop', preventDefault);

        // Cleanup function
        return () => {
            window.removeEventListener('dragstart', preventDefault);
            window.removeEventListener('drop', preventDefault);
        };
    }, []);

    return (
        <SidebarStateProvider>
            <CalendarViewProvider>
                <AppRouter/>
            </CalendarViewProvider>
        </SidebarStateProvider>
    );
}
export default App;
