// app/context/FavoriteContext.tsx

import React, {createContext, useState, useCallback, useEffect} from 'react';

interface FavoriteContextType {
    favorites: string[];
    toggleFavorite: (playlistId: string) => void;
    fetchFavorites: () => void;
}

export const FavoriteContext = createContext<FavoriteContextType>({
    favorites: [],
    toggleFavorite: () => {
    },
    fetchFavorites: () => {
    },
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                              children,
                                                                          }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    
    const toggleFavorite = useCallback((playlistId: string) => {
        setFavorites((prev) =>
            prev.includes(playlistId)
                ? prev.filter((id) => id !== playlistId)
                : [...prev, playlistId]
        );
    }, []);
    
    const fetchFavorites = useCallback(async () => {
        try {
            const response = await fetch('/api/playlists/favorite', {
                credentials: 'include', // クッキーを含める
            });
            
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            } else {
                console.error('お気に入り情報の取得に失敗しました。');
            }
        } catch (error) {
            console.error('お気に入り情報の取得中にエラーが発生しました。', error);
        }
    }, []);
    
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);
    
    return (
        <FavoriteContext.Provider value={{favorites, toggleFavorite, fetchFavorites}}>
            {children}
        </FavoriteContext.Provider>
    );
};
