// app/context/PlaylistContext.tsx
"use client";

import React, {createContext, useContext, useState} from "react";

interface PlaylistContextType {
    selectedPlaylistId: string | null;
    setSelectedPlaylistId: (id: string | null) => void;
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export const PlaylistContextProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    
    return (
        <PlaylistContext.Provider value={{selectedPlaylistId, setSelectedPlaylistId}}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error("usePlaylist must be used within a PlaylistContextProvider");
    }
    return context;
};
