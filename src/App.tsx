import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";
import {CalendarViewProvider} from "./page/calendar/context/CalendarViewContext";
import {AuthProvider} from "./context/AuthContext";
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {

    return (
        <Router>
            <AuthProvider>
                <SidebarStateProvider>
                    <CalendarViewProvider>
                        <AppRouter/>
                    </CalendarViewProvider>
                </SidebarStateProvider>
            </AuthProvider>
        </Router>
    );
}
export default App;
