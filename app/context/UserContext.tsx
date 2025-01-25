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
    /** ログイン処理を開始する関数 */
    login: () => void;
    /** ログアウト処理を実行する関数 */
    logout: () => Promise<void>;
    /** セッションを検証する関数 */
    checkSession: (temporaryToken: string) => Promise<void>;
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
            if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
                console.log("モックモード: 自動セッションチェックをスキップします");
                return; // モックモードでは自動セッションチェックをスキップ
            }
            try {
                const response = await fetch("/api/session/check", {
                    method: 'GET',
                    credentials: 'include', // Cookieを含める
                    cache: 'no-store', // キャッシュを無効化
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
    
    useEffect(() => {
        console.log(`isLoggedIn状態が変更されました: ${isLoggedIn}`);
    }, [isLoggedIn]);
    
    // セッション確立処理
    const checkSession = async (temporaryToken: string) => {
        try {
            const response = await fetch('/api/session/sessionId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({temporaryToken}),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.sessionId) {
                const sessionData = await (await fetch('/api/session/check', {
                    credentials: 'include',
                    cache: 'no-store',
                })).json();
                if (sessionData.status === 'success') {
                    setIsLoggedIn(true);
                    setUserId(sessionData.userId);
                }
            }
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    };
    
    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`;
    };
    
    const logout = async () => {
        try {
            const response = await fetch(`/api/session/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                setIsLoggedIn(false);
                setUserId(null);
            } else {
                const errorData = await response.json();
                console.error("ログアウトエラー:", errorData);
                setError("ログアウト中にエラーが発生しました。");
            }
        } catch (error) {
            // 適切なエラー処理を追加
            console.error("ログアウトエラー:", error);
            setError("ログアウト中にエラーが発生しました。");
        }
    };
    
    
    // コンテキストに提供する値を定義
    const contextValue = {isLoggedIn, userId, error, setIsLoggedIn, setUserId, login, logout, checkSession};
    
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
