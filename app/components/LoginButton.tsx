"use client";

import React from 'react';
import axios from 'axios';
import {Button} from "./ui/button";
import {useQuery, useMutation, useQueryClient} from 'react-query';

interface LoginButtonProps {
    onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
    const queryClient = useQueryClient();
    
    const {data: loginStatus, isLoading} = useQuery('loginStatus', async () => {
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
    }, {
        onSuccess: (isLoggedIn) => {
            if (isLoggedIn) {
                onLoginSuccess();
            }
        }
    });
    
    
    const logoutMutation = useMutation(
        async () => {
            await axios.post('http://localhost:8080/logout', {}, {withCredentials: true});
        },
        {
            onSuccess: () => {
                queryClient.setQueryData('loginStatus', false);
                window.location.reload();
            },
            onError: (error) => {
                console.error('ログアウトエラー:', error);
            }
        }
    );
    
    const handleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/spotify';
    };
    
    if (isLoading) {
        return <Button disabled>読み込み中...</Button>;
    }
    
    return (
        <div>
            {loginStatus ? (
                <Button onClick={() => logoutMutation.mutate()}>ログアウト</Button>
            ) : (
                <Button onClick={handleLogin}>Spotifyでログイン</Button>
            )}
        </div>
    );
};

export default LoginButton;
