import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Home} from "../page/home/Home";
import {Login} from "../page/auth/Login";
import {Signup} from "../page/auth/Signup";
import {Dashboard} from "../page/dashboard/Dashboard";
import {CalendarPage} from "../page/calendar/CalendarPage";
import {Routine} from "../page/routine/Routine";
import {TaskPage} from "../page/task/TaskPage";
import React from "react";
import {Report} from "../page/report/Report";
import {Setting} from "../page/setting/Setting";
import {OAuth2RedirectHandler} from "../handler/OAuth2RedirectHandler";
import {Profile} from "../page/profile/Profile";
import {ProfileUpdate} from "../page/profile/ProfileUpdate";
import {Register} from "../page/register/Register";

export const AppRouter = (): React.JSX.Element => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/calendar" element={<CalendarPage/>}/>
                <Route path="/routine" element={<Routine/>}/>
                <Route path="/task" element={<TaskPage/>}/>
                <Route path="/report" element={<Report/>}/>
                <Route path="/setting" element={<Setting/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/profile/update" element={<ProfileUpdate/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
            </Routes>
        </Router>
    );
}
