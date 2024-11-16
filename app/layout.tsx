// app/layout.tsx

"use client";

import '@/app/globals.css';
import Footer from '@/app/components/Footer'
import {TooltipProvider} from '@/app/components/ui/tooltip'
import {Inter} from 'next/font/google';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from "@/app/context/UserContext";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import {ThemeProvider} from 'next-themes';

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
        <html lang="ja" suppressHydrationWarning>
        <body className={`${inter.className}`}>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <ThemeProvider enableSystem={true} attribute="class" defaultTheme="system">
                        <TooltipProvider>
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer/>
                        </TooltipProvider>
                    </ThemeProvider>
                </UserContextProvider>
            </QueryClientProvider>
        </ErrorBoundary>
        </body>
        </html>
    );
}
