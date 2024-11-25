// src/context/AuthContext.tsx
import React, {createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect, useRef} from 'react';
import {existAuthCookie, getAuthCookie, removeAuthCookie} from "../../util/CookieUtil";
import {useLocation, useNavigate} from "react-router-dom";

interface AuthContextProps {
    handleLogin: () => void;
    handleLogout: () => void;
    authToken: string | undefined;
    setAuthToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useRef(useNavigate());
    const location = useRef(useLocation());
    const [authToken, setAuthToken] = useState<string | undefined>(getAuthCookie());

    useEffect(() => {
        if (authToken && location.current.pathname === "/") {
            navigate.current("/dashboard");
        }
    }, [authToken])

    const handleLogout = useCallback(() => {
        if (existAuthCookie()) {
            removeAuthCookie();
            setAuthToken(undefined);
            navigate.current("/");
        }
    }, []);

    const handleLogin = useCallback(() => {
        navigate.current("/login");
    }, []);

    const contextValue: AuthContextProps = useMemo(() => ({
        handleLogin,
        handleLogout,
        authToken,
        setAuthToken
    }), [authToken, handleLogin, handleLogout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
