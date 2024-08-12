// app/components/LoginButton.tsx

"use client";

import React from 'react';
import {Button} from "./ui/button";
import {useUser} from "../context/UserContext";

/**
 * ログインボタンコンポーネント
 *
 * @remarks
 * ユーザーのログイン状態に応じて、ログインまたはログアウトのアクションを実行します。
 *
 * @returns ログインまたはログアウトボタンを含むReactコンポーネント
 */
const LoginButton: React.FC = () => {
    // ユーザーのログイン状態とユーザーIDを管理するカスタムフックを使用
    const {isLoggedIn, setUserId, setIsLoggedIn} = useUser();
    
    console.log('LoginButton コンポーネントがレンダリングされました', {isLoggedIn});
    
    /**
     * ログイン処理を開始する関数
     *
     * @remarks
     * SpotifyのOAuth2認証ページにリダイレクトします。
     */
    const handleLogin = () => {
        console.log('ログイン処理を開始します');
        const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/spotify`;
        console.log('リダイレクト先:', {loginUrl});
        window.location.href = loginUrl; // 認証ページにリダイレクト
    };
    
    /**
     * ログアウト処理を実行する非同期関数
     *
     * @remarks
     * セッションを終了し、ユーザーIDをクリアします。
     * 成功時にはページをリロードします。
     */
    const handleLogout = async () => {
        console.log('ログアウトを実行しています');
        try {
            const response = await fetch(`/api/session/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                setIsLoggedIn(false); // ログイン状態を更新
                setUserId(null); // ユーザーIDをクリア
                console.log('ログアウトが成功しました');
                window.location.reload(); // ログアウト成功時にページをリロード
            } else {
                console.error('ログアウト中にエラーが発生しました:', response.statusText);
            }
        } catch (error) {
            console.error('ログアウト中にエラーが発生しました:', error);
        }
    };
    
    return (
        <Button onClick={() => {
            console.log('ボタンがクリックされました', {isLoggedIn});
            isLoggedIn ? handleLogout() : handleLogin(); // ログイン状態に応じて処理を切り替え
        }}>
            {isLoggedIn ? 'ログアウト' : 'Spotifyでログイン'} // ボタンのラベルを動的に変更
        </Button>
    );
};

export default LoginButton;
