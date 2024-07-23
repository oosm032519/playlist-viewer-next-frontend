// app/page.tsx
import React from "react";
import dynamic from 'next/dynamic';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from "./context/UserContext";
import {PlaylistContextProvider} from "./context/PlaylistContext";
import {FavoriteProvider} from '@/app/context/FavoriteContext'
import {Toaster} from "@/app/components/ui/toaster";

const DynamicHomeContent = dynamic(() => import('./components/HomeContent'), {
    ssr: false,
});

const queryClient = new QueryClient();

export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteProvider>
                        <DynamicHomeContent/>
                        <Toaster/>
                    </FavoriteProvider>
                </PlaylistContextProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
}
