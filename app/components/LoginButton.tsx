// app/components/LoginButton.tsx
"use client";

import React from 'react';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";

/**
 * ログインボタンコンポーネント
 * ユーザーのログイン状態に応じて、ログインまたはログアウトを行うボタンを表示します。
 */
const LoginButton: React.FC = () => {
    const {isLoggedIn, setUserId, setIsLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    console.log('LoginButton コンポーネントがレンダリングされました', {isLoggedIn});
    
    /**
     * ログイン処理を開始する関数
     * Spotifyの認証URLにリダイレクトします。
     */
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`;
        console.log('リダイレクト先:', {loginUrl});
        
        // リダイレクト
        window.location.href = loginUrl;
    };
    
    /**
     * ログアウト処理を行う関数
     */
    const handleLogout = () => {
        console.log('ログアウトを実行しています');
        // セッションストレージからJWTトークンを削除
        sessionStorage.removeItem('JWT');
        setIsLoggedIn(false);
        setUserId(null);
        window.location.reload(); // ログアウト成功時にページをリロード
    };
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました', {isLoggedIn});
            isLoggedIn ? handleLogout() : handleLogin(); // ログイン状態に応じて処理を分岐
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'} {/* ボタンのラベルを動的に変更 */}
        </Button>
    );
};

export default LoginButton;
