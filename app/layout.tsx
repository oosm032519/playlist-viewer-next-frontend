// app/layout.tsx
"use client";

import './globals.css';
import {Inter} from 'next/font/google';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from "./context/UserContext"; // 新しいコンテキストプロバイダをインポート

const inter = Inter({subsets: ['latin']});

// QueryClientのインスタンスを作成
const queryClient = new QueryClient();

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-dark text-gray-100`}>
        <QueryClientProvider client={queryClient}>
            <UserContextProvider> {/* UserContextProviderでラップ */}
                {children}
            </UserContextProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
