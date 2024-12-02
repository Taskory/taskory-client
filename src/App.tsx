import React from 'react';
import {AppRouter} from "./router/AppRouter";
import {SidebarStateProvider} from "./context/SidebarStateContext";
import {AuthProvider} from "./context/AuthContext";
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {

    return (
        <Router>
            <AuthProvider>
                <SidebarStateProvider>
                    <AppRouter/>
                </SidebarStateProvider>
            </AuthProvider>
        </Router>
    );
}
export default App;
