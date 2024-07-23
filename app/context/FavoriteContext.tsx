// app/context/FavoriteContext.tsx

import React, {createContext, useState, useCallback, useEffect} from 'react';

interface FavoriteContextType {
    favorites: { [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string } };
    addFavorite: (playlistId: string, playlistName: string, totalTracks: number) => void;
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
    const [favorites, setFavorites] = useState<{
        [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string }
    }>({});
    
    const addFavorite = useCallback((playlistId: string, playlistName: string, totalTracks: number) => {
        setFavorites((prev) => ({
            ...prev,
            [playlistId]: {playlistName, totalTracks, addedAt: new Date().toISOString()}
        }));
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
                const data: {
                    playlistId: string;
                    playlistName: string,
                    totalTracks: number,
                    addedAt: string
                }[] = await response.json();
                const newFavorites: {
                    [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string }
                } = {};
                data.forEach((item) => {
                    newFavorites[item.playlistId] = {
                        playlistName: item.playlistName,
                        totalTracks: item.totalTracks,
                        addedAt: item.addedAt,
                    };
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
