import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";

const App = () => {
    window.addEventListener("wheel", (event: WheelEvent) => {
        event.preventDefault();
    }, { passive: false });
    return (
        <SidebarStateProvider>
            <AppRouter/>
        </SidebarStateProvider>
    );
}
export default App;
