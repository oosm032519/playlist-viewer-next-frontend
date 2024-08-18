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
        console.log("UserContextProvider useEffect 開始");
        
        // セッションを初期化する非同期関数
        const initializeSession = async () => {
            try {
                console.log("セッション初期化開始");
                const response = await fetch("/api/session/check", {
                    method: 'GET',
                    credentials: 'include', // Cookieを含める
                });
                
                if (!response.ok) {
                    console.log(`セッションチェックエラー: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("セッションチェック成功:", data);
                
                if (data.status === 'success') {
                    console.log("ログイン状態です。");
                    setIsLoggedIn(true);
                    setUserId(data.userId);
                } else {
                    console.log("未ログイン状態です。");
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                handleApiError(error);
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
        console.error("UserContextProviderの外でuseUserが使用されました");
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
