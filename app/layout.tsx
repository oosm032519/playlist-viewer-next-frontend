// app/layout.tsx

import './globals.css';
import {Inter} from 'next/font/google';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from "./context/UserContext";

const inter = Inter({subsets: ['latin']});

export default function RootLayout({children}: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-dark text-gray-100`}>
        {children}
        </body>
        </html>
    );
}
