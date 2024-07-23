// app/components/LoginButton.tsx
"use client";

import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";
import {useRouter} from 'next/navigation';

const LoginButton: React.FC = () => {
    const {isLoggedIn} = useUser();
    const router = useRouter();
    console.log('LoginButton コンポーネントがレンダリングされました', isLoggedIn);
    
    const logoutMutation = useMutation({
        mutationFn: async () => {
            console.log('ログアウトを実行しています');
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('ログアウトに失敗しました');
            }
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
        router.push('/api/login');
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
