// Context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const storedAuthUser = JSON.parse(localStorage.getItem("authUser"));
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const [authUser, setAuthUser] = useState(storedAuthUser || null);
    const [isLoggedIn, setIsLoggedIn] = useState(storedIsLoggedIn || false);

    useEffect(() => {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        localStorage.setItem("isLoggedIn", String(isLoggedIn));
    }, [authUser, isLoggedIn]);

    return (
        <AuthContext.Provider
            value={{ authUser, setAuthUser, isLoggedIn, setIsLoggedIn }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};