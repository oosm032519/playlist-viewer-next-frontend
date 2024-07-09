// app/components/LoginButton.tsx

"use client";

import React from 'react';
import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import {Button} from "./ui/button";

interface LoginButtonProps {
    isLoggedIn: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({isLoggedIn}) => {
    console.log('LoginButton コンポーネントがレンダリングされました', isLoggedIn);
    
    const logoutMutation = useMutation({
        mutationFn: async () => {
            console.log('ログアウトを実行しています');
            await axios.post('/api/logout', {}, {withCredentials: true});
        },
        onSuccess: () => {
            console.log('ログアウト成功');
            window.location.reload();
        },
        onError: (error) => {
            console.error('ログアウトエラー:', error);
        }
    });
    
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
        console.log('リダイレクト先:', loginUrl);
        window.location.href = loginUrl;
    }
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました');
            isLoggedIn ? logoutMutation.mutate() : handleLogin();
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

export default LoginButton;
