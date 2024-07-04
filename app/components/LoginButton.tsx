// app/components/LoginButton.tsx

"use client";

import React from 'react';
import axios from 'axios';
import {Button} from "./ui/button";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

interface LoginButtonProps {
    onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
    console.log('LoginButton コンポーネントがレンダリングされました');
    const queryClient = useQueryClient();
    
    const {data: isLoggedIn, isLoading} = useQuery<boolean, Error>({
        queryKey: ['loginStatus'],
        queryFn: checkLoginStatus,
    });
    
    React.useEffect(() => {
        console.log('useEffect: isLoggedIn の状態が変更されました', isLoggedIn);
        if (isLoggedIn) {
            console.log('ログイン成功、onLoginSuccess を呼び出します');
            onLoginSuccess();
        }
    }, [isLoggedIn, onLoginSuccess]);
    
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            console.log('ログアウト成功');
            queryClient.setQueryData(['loginStatus'], false);
            queryClient.invalidateQueries({queryKey: ['loginStatus']});
            window.location.reload();
        },
        onError: (error) => {
            console.error('ログアウトエラー:', error);
        }
    });
    
    if (isLoading) {
        console.log('ログイン状態を読み込み中...');
        return <Button disabled>読み込み中...</Button>;
    }
    
    console.log('現在のログイン状態:', isLoggedIn);
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました');
            isLoggedIn ? logoutMutation.mutate() : handleLogin();
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

async function checkLoginStatus() {
    console.log('ログイン状態をチェックしています');
    try {
        const response = await fetch('/api/session/check', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Session check response:", data);
        const isLoggedIn = data && data.status === 'success';
        console.log('ログイン状態:', isLoggedIn);
        return isLoggedIn;
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return false;
    }
}

async function logout() {
    console.log('ログアウトを実行しています');
    try {
        await axios.post('/api/logout', {}, {withCredentials: true});
        console.log('ログアウト成功');
    } catch (error) {
        console.error('ログアウトエラー:', error);
        throw error;
    }
}

function handleLogin() {
    console.log('ログイン処理を開始します');
    const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
    console.log('リダイレクト先:', loginUrl);
    window.location.href = loginUrl;
}

export default LoginButton;
