import React, {createContext, useState, useCallback, useEffect} from 'react';
import {useUser} from './UserContext'; // UserContextをインポート

interface FavoriteContextType {
    favorites: { [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string } };
    addFavorite: (playlistId: string, playlistName: string, totalTracks: number) => void;
    removeFavorite: (playlistId: string) => void;
    fetchFavorites: () => Promise<void>;
}

export const FavoriteContext = createContext<FavoriteContextType>({
    favorites: {},
    addFavorite: () => {
    },
    removeFavorite: () => {
    },
    fetchFavorites: async () => {
    },
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                              children,
                                                                          }) => {
    const [favorites, setFavorites] = useState<{
        [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string }
    }>({});
    const {isLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    
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
        if (!isLoggedIn) {
            setFavorites({}); // ログアウト時はお気に入りをクリア
            return;
        }
        try {
            const response = await fetch(`/api/playlists/favorites`, {
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
    }, [isLoggedIn]);
    
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites, isLoggedIn]); // isLoggedInが変更されたときにfetchFavoritesを呼び出す
    
    return (
        <FavoriteContext.Provider value={{favorites, addFavorite, removeFavorite, fetchFavorites}}>
            {children}
        </FavoriteContext.Provider>
    );
};
