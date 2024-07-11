// app/components/LoginButton.tsx
"use client";

import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";

/**
 * ログインボタンコンポーネント
 * ユーザーのログイン状態に応じて、ログインまたはログアウトを行うボタンを表示します。
 */
const LoginButton: React.FC = () => {
    const {isLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    console.log('LoginButton コンポーネントがレンダリングされました', isLoggedIn);
    
    /**
     * ログアウト処理を行うためのReact QueryのuseMutationフック
     */
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
            window.location.reload(); // ログアウト成功時にページをリロード
        },
        onError: (error) => {
            console.error('ログアウトエラー:', error); // エラー発生時のログ出力
        }
    });
    
    /**
     * ログイン処理を開始する関数
     * Spotifyの認証URLにリダイレクトします。
     */
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
        console.log('リダイレクト先:', loginUrl);
        window.location.href = loginUrl; // 認証URLにリダイレクト
    }
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました');
            isLoggedIn ? logoutMutation.mutate() : handleLogin(); // ログイン状態に応じて処理を分岐
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'} {/* ボタンのラベルを動的に変更 */}
        </Button>
    );
};

export default LoginButton;
