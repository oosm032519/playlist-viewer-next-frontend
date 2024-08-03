// app/components/LoginButton.tsx
"use client";

import React from 'react';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";

/**
 * ログインボタンコンポーネント
 * ユーザーのログイン状態に応じて、ログインまたはログアウトを行うボタンを表示します。
 */
const LoginButton: React.FC = () => {
    const {isLoggedIn, setUserId, setIsLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    console.log('LoginButton コンポーネントがレンダリングされました', {isLoggedIn});
    
    /**
     * ログイン処理を開始する関数
     * Spotifyの認証URLにリダイレクトします。
     */
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`;
        console.log('リダイレクト先:', {loginUrl});
        
        // 新しいウィンドウを開く
        const loginWindow = window.open(loginUrl, '_blank', 'width=500,height=600');
        
        // message イベントリスナーを設定
        window.addEventListener('message', (event) => {
            if (event.origin === process.env.NEXT_PUBLIC_BACKEND_URL) {
                if (event.data.token) {
                    // JWT トークンをセッションストレージに保存
                    sessionStorage.setItem('JWT', event.data.token);
                    
                    // ログイン状態を更新
                    setIsLoggedIn(true);
                    setUserId(event.data.userId); // もしユーザーIDも送られてくるなら
                    
                    // ログインウィンドウを閉じる
                    if (loginWindow) {
                        loginWindow.close();
                    }
                    
                    // 必要に応じてページをリロード
                    window.location.reload();
                }
            }
        });
    };
    
    /**
     * ログアウト処理を行う関数
     */
    const handleLogout = () => {
        console.log('ログアウトを実行しています');
        // セッションストレージからJWTトークンを削除
        sessionStorage.removeItem('JWT');
        setIsLoggedIn(false);
        setUserId(null);
        window.location.reload(); // ログアウト成功時にページをリロード
    };
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました', {isLoggedIn});
            isLoggedIn ? handleLogout() : handleLogin(); // ログイン状態に応じて処理を分岐
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'} {/* ボタンのラベルを動的に変更 */}
        </Button>
    );
};

export default LoginButton;
