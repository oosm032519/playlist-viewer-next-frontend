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
        console.log("UserContextProvider useEffect 開始");
        const initializeSession = async () => {
            try {
                console.log("セッション初期化開始");
                const response = await fetch("/api/auth/get-jwt", {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    console.log(`JWT取得エラー: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("JWT取得成功:", data);
                
                if (data.jwt) {
                    console.log("JWTが存在します。ログイン状態を設定します。");
                    setIsLoggedIn(true);
                    
                    const userResponse = await fetch("/api/session/check", {
                        headers: {
                            'Authorization': `Bearer ${data.jwt}`,
                        },
                    });
                    
                    if (!userResponse.ok) {
                        console.log(`ユーザー情報取得エラー: ${userResponse.status}`);
                        throw new Error(`HTTP error! status: ${userResponse.status}`);
                    }
                    
                    const userData = await userResponse.json();
                    console.log("ユーザー情報取得成功:", userData);
                    setUserId(userData.userId);
                } else {
                    console.log("JWTが存在しません。未ログイン状態です。");
                }
            } catch (error) {
                console.error("セッション初期化中にエラーが発生しました:", error);
                setError("セッション初期化中にエラーが発生しました。");
            }
        };
        
        initializeSession();
    }, []);
    
    useEffect(() => {
        console.log("ログイン状態更新:", isLoggedIn);
    }, [isLoggedIn]);
    
    useEffect(() => {
        console.log("ユーザーID更新:", userId);
    }, [userId]);
    
    useEffect(() => {
        if (error) {
            console.log("エラー状態更新:", error);
        }
    }, [error]);
    
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
        console.error("UserContextProviderの外でuseUserが使用されました");
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
