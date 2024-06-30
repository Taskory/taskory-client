import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";
import {setAuthCookie} from "./util/CookieUtil";

const App = () => {

    // set Temp auth cookie
    setAuthCookie("temp cookie");
    return (
        <SidebarStateProvider>
            <AppRouter/>
        </SidebarStateProvider>
    );
}
export default App;
