import React, {useEffect} from 'react';
import {GOOGLE_AUTH_URL} from "../../constants";
import {existAuthCookie, removeAuthCookie} from "../../util/CookieUtil";


export const Login = () => {
    useEffect(() => {
        if (existAuthCookie()) removeAuthCookie()
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Welcome back!</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Log in to continue manage your tasks.
                </p>
                <div className="h-auto space-y-2 my-4">
                    <a className="flex justify-start btn w-full h-min" href={GOOGLE_AUTH_URL}>
                        <img className={"size-1/12"} src="/asset/img/social/google-logo.png" alt="Google"/>
                        <p className={"ml-4"}>Log in with Google</p>
                    </a>
                </div>
            </div>
        </div>
    );


}