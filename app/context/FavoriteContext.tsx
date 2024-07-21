// app/context/FavoriteContext.tsx

import React, {createContext, useState, useCallback} from 'react';

interface FavoriteContextType {
    favorites: string[];
    toggleFavorite: (playlistId: string) => void;
}

export const FavoriteContext = createContext<FavoriteContextType>({
    favorites: [],
    toggleFavorite: () => {
    },
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    
    const toggleFavorite = useCallback((playlistId: string) => {
        setFavorites(prev =>
            prev.includes(playlistId)
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );
    }, []);
    
    return (
        <FavoriteContext.Provider value={{favorites, toggleFavorite}}>
            {children}
        </FavoriteContext.Provider>
    );
};
