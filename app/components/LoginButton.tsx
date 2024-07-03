"use client";

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button} from "./ui/button";

interface LoginButtonProps {
    onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/session', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            console.log("Session check response:", data);
            if (data && data.status === 'success') {
                setIsLoggedIn(true);
                onLoginSuccess();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('セッションチェックエラー:', error);
            setIsLoggedIn(false);
        }
    };
    
    useEffect(() => {
        checkLoginStatus();
    }, [onLoginSuccess]);
    
    const handleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/spotify';
    };
    
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout', {}, {withCredentials: true});
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
