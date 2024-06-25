// app/components/LoginButton.tsx
"use client";

import {Button} from "./ui/button";

const LoginButton = () => {
    const handleLogin = () => {
        // バックエンドの認証エンドポイントにリダイレクト
        window.location.href = "http://localhost:8080/oauth2/authorization/spotify";
    };
    
    return (
        <Button onClick={handleLogin}>Spotifyでログイン</Button>
    );
};

export default LoginButton;
