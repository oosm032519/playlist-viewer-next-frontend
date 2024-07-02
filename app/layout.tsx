// app/layout.tsx
"use client";

import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const inter = Inter({subsets: ['latin']});

// QueryClientのインスタンスを作成
const queryClient = new QueryClient();

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-dark text-gray-100`}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        </body>
        </html>
    );
}
