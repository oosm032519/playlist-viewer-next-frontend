// app/components/LoginButton.tsx

"use client";

import {Button} from "@/app/components/ui/button";
import {useUser} from "@/app/context/UserContext";
import React from 'react';

/**
 * ログインボタンコンポーネント
 *
 * @remarks
 * ユーザーのログイン状態に応じて、ログインまたはログアウトのアクションを実行します。
 *
 * @returns ログインまたはログアウトボタンを含むReactコンポーネント
 */
const LoginButton: React.FC = () => {
    // ユーザーのログイン状態とユーザーIDを管理するカスタムフックを使用
    const {isLoggedIn, setUserId, setIsLoggedIn} = useUser();
    
    /**
     * ログイン処理を開始する関数
     *
     * @remarks
     * SpotifyのOAuth2認証ページにリダイレクトします。
     */
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`; // 認証ページにリダイレクト
    };
    
    /**
     * ログアウト処理を実行する非同期関数
     *
     * @remarks
     * セッションを終了し、ユーザーIDをクリアします。
     * 成功時にはページをリロードします。
     */
    const handleLogout = async () => {
        try {
            const response = await fetch(`/api/session/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                setIsLoggedIn(false); // ログイン状態を更新
                setUserId(null); // ユーザーIDをクリア
                window.location.reload(); // ログアウト成功時にページをリロード
            } else {
            }
        } catch (error) {
        }
    };
    
    return (
        <Button onClick={() => {
            isLoggedIn ? handleLogout() : handleLogin();
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

export default LoginButton;
