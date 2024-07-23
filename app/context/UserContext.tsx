"use client";

import React, {createContext, useContext, useState, useEffect} from "react";
import {checkSession} from "../lib/checkSession";

interface UserContextType {
    isLoggedIn: boolean;
    userId: string | null;
    error: string | null;
    setIsLoggedIn: (value: boolean) => void;
    setUserId: (value: string | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const initializeSession = async () => {
            try {
                const sessionStatus = await checkSession();
                setIsLoggedIn(sessionStatus);
                
                if (sessionStatus) {
                    const response = await fetch("/api/session/check", {
                        credentials: "include",
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setUserId(data.userId);
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("ユーザーIDの取得中にエラーが発生しました:", error.message, (error as any).code);
                    setError("ユーザーIDの取得中にエラーが発生しました。");
                } else {
                    console.error("ユーザーIDの取得中にエラーが発生しました:", error);
                    setError("ユーザーIDの取得中にエラーが発生しました。");
                }
            }
        };
        initializeSession();
    }, []);
    
    const contextValue = {isLoggedIn, userId, error, setIsLoggedIn, setUserId};
    
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
