// app/context/FavoriteContext.tsx

import React, {createContext, useState, useCallback, useEffect} from 'react';
import {useUser} from './UserContext'; // UserContextをインポート

/**
 * @typedef Favorite
 * @property {string} playlistName - プレイリストの名前
 * @property {number} totalTracks - プレイリスト内のトラック数
 * @property {string} addedAt - お気に入りに追加された日時
 */

/**
 * @typedef FavoriteContextType
 * @property {{ [playlistId: string]: Favorite }} favorites - お気に入りのプレイリスト
 * @property {(playlistId: string, playlistName: string, totalTracks: number) => void} addFavorite - お気に入りを追加する関数
 * @property {(playlistId: string) => void} removeFavorite - お気に入りを削除する関数
 * @property {() => Promise<void>} fetchFavorites - お気に入りをサーバーから取得する関数
 */

interface FavoriteContextType {
    favorites: { [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string } };
    addFavorite: (playlistId: string, playlistName: string, totalTracks: number) => void;
    removeFavorite: (playlistId: string) => void;
    fetchFavorites: () => Promise<void>;
}

/**
 * お気に入りのプレイリストを管理するコンテキスト
 */
export const FavoriteContext = createContext<FavoriteContextType>({
    favorites: {},
    addFavorite: () => {
    },
    removeFavorite: () => {
    },
    fetchFavorites: async () => {
    },
});

/**
 * @component
 * @param {{ children: React.ReactNode }} props - 子コンポーネント
 * @returns {JSX.Element} FavoriteContext.Providerを返す
 *
 * @description
 * お気に入りのプレイリストを管理するプロバイダーコンポーネント。
 * 子コンポーネントにお気に入りの状態と操作を提供する。
 */
export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // お気に入りの状態を管理する
    const [favorites, setFavorites] = useState<{
        [playlistId: string]: { playlistName: string, totalTracks: number, addedAt: string }
    }>({});
    
    const {isLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    
    /**
     * お気に入りを追加する
     * @param {string} playlistId - プレイリストのID
     * @param {string} playlistName - プレイリストの名前
     * @param {number} totalTracks - プレイリスト内のトラック数
     */
    const addFavorite = useCallback((playlistId: string, playlistName: string, totalTracks: number) => {
        setFavorites((prev) => ({
            ...prev,
            [playlistId]: {playlistName, totalTracks, addedAt: new Date().toISOString()}
        }));
    }, []);
    
    /**
     * お気に入りを削除する
     * @param {string} playlistId - 削除するプレイリストのID
     */
    const removeFavorite = useCallback((playlistId: string) => {
        setFavorites((prev) => {
            const {[playlistId]: _, ...rest} = prev;
            return rest;
        });
    }, []);
    
    /**
     * サーバーからお気に入りを取得する
     */
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
    
    // コンポーネントのマウント時とisLoggedInが変更されたときにfetchFavoritesを呼び出す
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites, isLoggedIn]);
    
    return (
        <FavoriteContext.Provider value={{favorites, addFavorite, removeFavorite, fetchFavorites}}>
            {children}
        </FavoriteContext.Provider>
    );
};
