"use client";

import React from 'react';
import axios from 'axios';
import {Button} from "./ui/button";

interface LoginButtonProps {
    isLoggedIn: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({isLoggedIn}) => {
    console.log('LoginButton コンポーネントがレンダリングされました', isLoggedIn);
    
    const logout = async () => {
        console.log('ログアウトを実行しています');
        try {
            await axios.post('/api/logout', {}, {withCredentials: true});
            console.log('ログアウト成功');
            // ログアウト後にページをリロード
            window.location.reload();
        } catch (error) {
            console.error('ログアウトエラー:', error);
            throw error;
        }
    }
    
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
        console.log('リダイレクト先:', loginUrl);
        window.location.href = loginUrl;
    }
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました');
            isLoggedIn ? logout() : handleLogin();
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

export default LoginButton;
