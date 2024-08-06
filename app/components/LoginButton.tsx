"use client";

import React from 'react';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";

const LoginButton: React.FC = () => {
    const {isLoggedIn, setUserId, setIsLoggedIn} = useUser();
    console.log('LoginButton コンポーネントがレンダリングされました', {isLoggedIn});
    
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`;
        console.log('リダイレクト先:', {loginUrl});
        window.location.href = loginUrl;
    };
    
    const handleLogout = async () => {
        console.log('ログアウトを実行しています');
        try {
            const response = await fetch('/api/session/delete-jwt', {
                method: 'DELETE',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error('ログアウト処理に失敗しました');
            }
            
            // セッションストレージからJWTトークンを削除
            sessionStorage.removeItem('JWT');
            setIsLoggedIn(false);
            setUserId(null);
            console.log('ログアウトが成功しました');
            window.location.reload(); // ログアウト成功時にページをリロード
        } catch (error) {
            console.error('ログアウト中にエラーが発生しました:', error);
        }
    };
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました', {isLoggedIn});
            isLoggedIn ? handleLogout() : handleLogin();
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

export default LoginButton;
