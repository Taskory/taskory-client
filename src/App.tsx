import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";

const App = () => {
    return (
        <SidebarStateProvider>
            <AppRouter/>
        </SidebarStateProvider>
    );
}
export default App;
