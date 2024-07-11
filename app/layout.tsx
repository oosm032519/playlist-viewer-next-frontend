// app/layout.tsx

"use client";

import './globals.css';
import {Inter} from 'next/font/google';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from "./context/UserContext";

// Interフォントを設定
const inter = Inter({subsets: ['latin']});

// QueryClientのインスタンスを作成
const queryClient = new QueryClient();

/**
 * アプリケーションのルートレイアウトコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element} ルートレイアウトを表すJSX要素
 */
export default function RootLayout({children}: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-dark text-gray-100`}>
        {/* React Queryのクライアントプロバイダでラップ */}
        <QueryClientProvider client={queryClient}>
            {/* ユーザーコンテキストプロバイダでラップ */}
            <UserContextProvider>
                {children}
            </UserContextProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
