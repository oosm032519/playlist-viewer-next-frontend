"use client";

import React from 'react';
import axios from 'axios';
import {Button} from "./ui/button";
import {useMutation, useQuery, useQueryClient} from 'react-query';

interface LoginButtonProps {
    onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
    const queryClient = useQueryClient();
    
    const {data: isLoggedIn, isLoading} = useQuery('loginStatus', checkLoginStatus, {
        onSuccess: (isLoggedIn) => {
            if (isLoggedIn) {
                onLoginSuccess();
            }
        }
    });
    
    const logoutMutation = useMutation(logout, {
        onSuccess: () => {
            queryClient.setQueryData('loginStatus', false);
            window.location.reload();
        },
        onError: (error) => {
            console.error('ログアウトエラー:', error);
        }
    });
    
    if (isLoading) {
        return <Button disabled>読み込み中...</Button>;
    }
    
    return (
        <Button onClick={isLoggedIn ? () => logoutMutation.mutate() : handleLogin}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'}
        </Button>
    );
};

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/session', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Session check response:", data);
        return data && data.status === 'success';
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return false;
    }
}

async function logout() {
    await axios.post('/api/logout', {}, {withCredentials: true});
}

function handleLogin() {
    window.location.href = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
}

export default LoginButton;
