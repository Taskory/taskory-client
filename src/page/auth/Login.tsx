import React from 'react';

export const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Welcome back!</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Log in to continue manage your tasks.
                </p>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            defaultValue="temp@gmail.com"
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
                                placeholder="Password"
                                defaultValue="password"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <svg className="h-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 12h2l4-4m0 0l-4-4m4 4H3m6 4h3"/>
                </svg>
              </span>
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
                        <a href="#"
                           className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800">
                            Forgot your password?
                        </a>
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Need help? </span>
                        <a href="#"
                           className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Contact Support
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );

}