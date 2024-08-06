"use client";

import React, {createContext, useContext, useState, useEffect} from "react";

interface UserContextType {
    isLoggedIn: boolean;
    userId: string | null;
    error: string | null;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUserId: (userId: string | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const initializeSession = async () => {
            try {
                const response = await fetch("/api/auth/get-jwt", {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.jwt) {
                    setIsLoggedIn(true);
                    
                    const userResponse = await fetch("/api/session/check", {
                        headers: {
                            'Authorization': `Bearer ${data.jwt}`,
                        },
                    });
                    
                    if (!userResponse.ok) {
                        throw new Error(`HTTP error! status: ${userResponse.status}`);
                    }
                    
                    const userData = await userResponse.json();
                    setUserId(userData.userId);
                }
            } catch (error) {
                console.error("セッション初期化中にエラーが発生しました:", error);
                setError("セッション初期化中にエラーが発生しました。");
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
