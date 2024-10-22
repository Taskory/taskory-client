// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { existAuthCookie, removeAuthCookie } from "../util/CookieUtil";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    handleLogin: () => void;
    handleLogout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        if (existAuthCookie()) {
            removeAuthCookie();
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = useCallback(() => {
        navigate("/login");
    }, [navigate]);

    const contextValue: AuthContextProps = useMemo(() => ({
        handleLogin,
        handleLogout,
    }), [handleLogin, handleLogout]);

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
