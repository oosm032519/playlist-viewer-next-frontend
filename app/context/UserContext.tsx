"use client";

import React, {createContext, useContext, useState, useEffect} from "react";

interface UserContextType {
    isLoggedIn: boolean;
    userId: string | null;
    error: string | null;
    isLoading: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUserId: (userId: string | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const initializeSession = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/session/get-jwt", {
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
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                console.error("セッション初期化中にエラーが発生しました:", error);
                setError("セッションの初期化に失敗しました");
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeSession();
    }, []);
    
    const contextValue = {isLoggedIn, userId, error, isLoading, setIsLoggedIn, setUserId};
    
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
