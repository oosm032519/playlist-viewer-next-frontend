// app/context/FavoriteContext.tsx

import React, {createContext, useState, useCallback, useEffect} from 'react';

interface FavoriteContextType {
    favorites: { [playlistId: string]: string };
    addFavorite: (playlistId: string, playlistName: string) => void;
    removeFavorite: (playlistId: string) => void;
    fetchFavorites: () => void;
}

export const FavoriteContext = createContext<FavoriteContextType>({
    favorites: {},
    addFavorite: () => {
    },
    removeFavorite: () => {
    },
    fetchFavorites: () => {
    },
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                              children,
                                                                          }) => {
    const [favorites, setFavorites] = useState<{ [playlistId: string]: string }>({});
    
    const addFavorite = useCallback((playlistId: string, playlistName: string) => {
        setFavorites((prev) => ({...prev, [playlistId]: playlistName}));
    }, []);
    
    const removeFavorite = useCallback((playlistId: string) => {
        setFavorites((prev) => {
            const {[playlistId]: _, ...rest} = prev;
            return rest;
        });
    }, []);
    
    const fetchFavorites = useCallback(async () => {
        try {
            const response = await fetch('/api/playlists/favorite', {
                credentials: 'include',
            });
            
            if (response.ok) {
                const data: { playlistId: string; playlistName: string }[] = await response.json();
                const newFavorites: { [playlistId: string]: string } = {};
                data.forEach((item) => {
                    newFavorites[item.playlistId] = item.playlistName;
                });
                setFavorites(newFavorites);
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
        <FavoriteContext.Provider value={{favorites, addFavorite, removeFavorite, fetchFavorites}}>
            {children}
        </FavoriteContext.Provider>
    );
};
