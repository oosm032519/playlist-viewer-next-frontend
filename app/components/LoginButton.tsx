// src/app/components/LoginButton.tsx

"use client";

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button} from "./ui/button";

interface LoginButtonProps {
    onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // セッション状態をチェックする関数を定義
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/session/check', {withCredentials: true});
            console.log("Session check response:", response.data);
            if (response.data.status === 'success') {
                setIsLoggedIn(true);
                onLoginSuccess();
            }
        } catch (error) {
            console.error('セッションチェックエラー:', error);
        }
    };
    
    useEffect(() => {
        // コンポーネントのマウント時にセッション状態をチェック
        checkLoginStatus();
    }, [onLoginSuccess]);
    
    const handleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/spotify';
    };
    
    // ログアウト処理を行う関数を定義
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout', {withCredentials: true});
            setIsLoggedIn(false);
            window.location.reload();
        } catch (error) {
            console.error('ログアウトエラー:', error);
        }
    };
    
    return (
        <div>
            {isLoggedIn ? (
                <Button onClick={handleLogout}>ログアウト</Button>
            ) : (
                <Button onClick={handleLogin}>Spotifyでログイン</Button>
            )}
        </div>
    );
};

export default LoginButton;
