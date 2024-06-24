import React, {useEffect, useState} from 'react';
import {API_URL, GOOGLE_AUTH_URL} from "../../constants";
import {useNavigate} from "react-router-dom";
import {existAuthCookie, removeAuthCookie, setAuthCookie} from "../../util/CookieUtil";


export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (existAuthCookie()) removeAuthCookie()
    }, []);

    const fetchLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: username,
                password: password
            }),
        }
        try {
            await fetch(API_URL + "/auth/login", requestOptions).then(res => {
                if (res.ok) {
                    res.json().then(result => {
                        setAuthCookie(result.token);
                        navigate("/");
                    });
                } else {
                    alert("이메일 및 비밀번호가 잘못되었습니다.")
                }
            })
        } catch (e) {
            alert("로그인 오류");
        }

    }

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 이벤트의 기본 동작 중지
        await fetchLogin();
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Welcome back!</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Log in to continue manage your tasks.
                </p>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            value={username}
                            placeholder="Username"
                            autoComplete="username"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                value={password}
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="button"
                        >
                            Login
                        </button>
                    </div>
                    <div className="text-center">
                        {/*<a href=""*/}
                        {/*   className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800">*/}
                        {/*    Forgot your password?*/}
                        {/*</a>*/}
                    </div>
                    <div className="h-auto space-y-2 my-4">
                        <a className="flex justify-start btn w-full h-min" href={GOOGLE_AUTH_URL}>
                            <img className={"size-1/12"} src="/asset/img/social/google-logo.png" alt="Google"/>
                            <p className={"ml-4"}>Log in with Google</p>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );


}