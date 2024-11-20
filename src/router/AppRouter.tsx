import {Route, Routes} from "react-router-dom";
import {Home} from "../page/home/Home";
import {Login} from "../page/auth/Login";
import {Dashboard} from "../page/dashboard/Dashboard";
import {CalendarPage} from "../page/calendar/CalendarPage";
import {Routine} from "../page/routine/Routine";
import React from "react";
import {Report} from "../page/report/Report";
import {Setting} from "../page/setting/Setting";
import {OAuth2RedirectHandler} from "../handler/OAuth2RedirectHandler";
import {Profile} from "../page/profile/Profile";
import {ProfileUpdate} from "../page/profile/ProfileUpdate";
import {Register} from "../page/register/Register";
import { TaskPage } from "../page/task/TaskPage";
import {Temp} from "../page/temp/Temp";
import { CommonLayout } from "../layout/CommonLayout";
import {HomeLayout} from "../layout/HomeLayout";

export const AppRouter = (): React.JSX.Element => {
    return (
        <Routes>
            {/* Routes with HomeLayout */}
            <Route element={<HomeLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/profile/update" element={<ProfileUpdate/>}/>
            </Route>

            {/* Routes with CommonLayout */}
            <Route element={<CommonLayout/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/calendar" element={<CalendarPage/>}/>
                <Route path="/task" element={<TaskPage/>}/>
                <Route path="/routine" element={<Routine/>}/>
                <Route path="/report" element={<Report/>}/>
                <Route path="/setting" element={<Setting/>}/>
                <Route path="/temp" element={<Temp/>}/>
            </Route>


            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
        </Routes>
    );
}
