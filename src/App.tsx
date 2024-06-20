import React from 'react';
import {AppRouter} from "./AppRouter";
import Cookies from "js-cookie";
import {SidebarStateProvider} from "./context/SidebarStateContext";

const App = () => {
    // temp token
    Cookies.set('token', "temp token");
    return (
        <SidebarStateProvider>
            <AppRouter/>
        </SidebarStateProvider>
    );
}
export default App;
