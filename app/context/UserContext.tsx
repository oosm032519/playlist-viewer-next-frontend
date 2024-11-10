// app/context/UserContext.tsx

"use client";

import React, {createContext, useContext, useState, useEffect} from "react";
import {handleApiError} from "@/app/lib/api-utils";

/**
 * ユーザーコンテキストの型定義
 */
interface UserContextType {
    /** ログイン状態を示すフラグ */
    isLoggedIn: boolean;
    /** ユーザーID（未ログイン時はnull） */
    userId: string | null;
    /** エラーメッセージ（エラーがない場合はnull） */
    error: string | null;
    /** ログイン状態を更新する関数 */
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    /** ユーザーIDを更新する関数 */
    setUserId: (userId: string | null) => void;
}

/** ユーザーコンテキストを生成 */
const UserContext = createContext<UserContextType | null>(null);

/**
 * UserContextProviderコンポーネント
 *
 * @param children - コンテキストプロバイダー内でレンダリングされる子要素
 * @returns UserContextを提供するプロバイダーコンポーネント
 */
export const UserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    // ログイン状態を管理するステート
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // ユーザーIDを管理するステート
    const [userId, setUserId] = useState<string | null>(null);
    // エラーメッセージを管理するステート
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // セッションを初期化する非同期関数
        const initializeSession = async () => {
            try {
                const response = await fetch("/api/session/check", {
                    method: 'GET',
                    credentials: 'include', // Cookieを含める
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    setIsLoggedIn(true);
                    setUserId(data.userId);
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                handleApiError(error);
            }
        };
        
        initializeSession();
    }, []);
    
    // コンテキストに提供する値を定義
    const contextValue = {isLoggedIn, userId, error, setIsLoggedIn, setUserId};
    
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * ユーザーコンテキストを利用するカスタムフック
 *
 * @returns UserContextの値
 * @throws コンテキストプロバイダーの外で使用された場合にエラーをスロー
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
