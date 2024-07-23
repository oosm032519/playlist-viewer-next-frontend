"use client";

import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";
import {useRouter} from 'next/navigation';

const LoginButton: React.FC = () => {
    const {isLoggedIn, setIsLoggedIn, setUserId} = useUser();
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
            setIsLoggedIn(false);
            setUserId(null);
            router.push('/');
        },
        onError: (error) => {
            console.error('ログアウトエラー:', error);
        }
    });
    
    const handleLogin = async () => {
        console.log('ログイン処理を開始します');
        try {
            const response = await fetch('/api/login');
            const data = await response.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                console.error('リダイレクトURLが見つかりません');
            }
        } catch (error) {
            console.error('ログインエラー:', error);
        }
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
