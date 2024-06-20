import React from 'react';
import {AppRouter} from "./AppRouter";
import Cookies from "js-cookie";

const App = () => {
    // temp token
    Cookies.set('token', "temp token");
    return (
        <AppRouter/>
    );
}
export default App;
