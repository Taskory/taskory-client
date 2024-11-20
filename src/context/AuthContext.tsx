// src/context/AuthContext.tsx
import React, {createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect, useRef} from 'react';
import {existAuthCookie, getAuthCookie, removeAuthCookie} from "../util/CookieUtil";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const [authToken, setAuthToken] = useState<string | undefined>(getAuthCookie());

    useEffect(() => {
        if (authToken) {
            navigateRef.current("/dashboard");
        }
    }, [authToken])

    const handleLogout = useCallback(() => {
        if (existAuthCookie()) {
            removeAuthCookie();
            setAuthToken(undefined);
            navigateRef.current("/");
        }
    }, []);

    const handleLogin = useCallback(() => {
        navigateRef.current("/login");
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
