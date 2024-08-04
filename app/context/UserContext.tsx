// app/context/UserContext.tsx
"use client";

import React, {createContext, useContext, useState, useEffect} from "react";

// ユーザーコンテキストの型定義
interface UserContextType {
    isLoggedIn: boolean;
    userId: string | null;
    error: string | null;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUserId: (userId: string | null) => void;
}

// ユーザーコンテキストの作成
const UserContext = createContext<UserContextType | null>(null);

/**
 * UserContextProviderコンポーネント
 * @param {React.PropsWithChildren<{}>} props - 子コンポーネントを含むプロパティ
 * @returns {JSX.Element} ユーザーコンテキストプロバイダー
 */
export const UserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    // ユーザーのログイン状態を管理するステート
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // ユーザーIDを管理するステート
    const [userId, setUserId] = useState<string | null>(null);
    // エラーメッセージを管理するステート
    const [error, setError] = useState<string | null>(null);
    
    // コンポーネントのマウント時にセッションを初期化する
    useEffect(() => {
        const initializeSession = async () => {
            try {
                // バックエンドAPIにJWTを送信してユーザーIDを取得
                const response = await fetch("/api/session/check", {
                    credentials: "include", // Cookieを含めて送信
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success') {
                    setIsLoggedIn(true);
                    setUserId(data.userId);
                }
            } catch (error) {
                // エラーが発生した場合の処理
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
    
    // コンテキストの値を設定
    const contextValue = {isLoggedIn, userId, error, setIsLoggedIn, setUserId};
    
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * useUserフック
 * @returns {UserContextType} ユーザーコンテキストの値
 * @throws {Error} UserContextProviderの外で使用された場合にエラーをスロー
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
