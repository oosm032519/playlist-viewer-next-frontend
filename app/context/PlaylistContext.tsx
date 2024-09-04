// app/context/PlaylistContext.tsx

"use client";

import React, {createContext, useContext, useState} from "react";

/**
 * プレイリストのコンテキストの型定義。
 * @property {string | null} selectedPlaylistId - 現在選択されているプレイリストのID。
 * @property {(id: string | null) => void} setSelectedPlaylistId - プレイリストのIDを設定する関数。
 */
interface PlaylistContextType {
    selectedPlaylistId: string | null;
    setSelectedPlaylistId: (id: string | null) => void;
}

// プレイリストのコンテキストを作成。初期値はnull。
const PlaylistContext = createContext<PlaylistContextType | null>(null);

/**
 * プレイリストコンテキストプロバイダー。
 * @param {React.PropsWithChildren<{}>} props - 子コンポーネントを含むプロパティ。
 * @returns {JSX.Element} プレイリストコンテキストを提供するプロバイダーコンポーネント。
 */
export const PlaylistContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    // 現在選択されているプレイリストのIDを管理するstate。
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    
    return (
        // コンテキストプロバイダーを使用して、子コンポーネントに値を提供。
        <PlaylistContext.Provider value={{selectedPlaylistId, setSelectedPlaylistId}}>
            {children}
        </PlaylistContext.Provider>
    );
};

/**
 * プレイリストコンテキストを利用するためのカスタムフック。
 * @throws {Error} コンテキストがプロバイダーの外で使用された場合にエラーをスロー。
 * @returns {PlaylistContextType} プレイリストコンテキストの値。
 */
export const usePlaylist = (): PlaylistContextType => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error("usePlaylist must be used within a PlaylistContextProvider");
    }
    return context;
};
