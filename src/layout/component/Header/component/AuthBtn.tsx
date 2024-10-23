import React from "react";
import {useAuthContext} from "../../../../context/AuthContext";

export const AuthBtn = () => {
    const {authToken} = useAuthContext();
    const {handleLogin, handleLogout} = useAuthContext();

    return (
        <>
            <div className="ml-4 mr-4">
                {authToken ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Login
                    </button>
                )}
            </div>
        </>
    );
};