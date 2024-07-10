// app/components/PlaylistDisplay.tsx
import PlaylistTable from "./PlaylistTable";
import PlaylistDetailsLoader from "./PlaylistDetailsLoader";
import FollowedPlaylists from "./FollowedPlaylists";
import {Playlist} from "../types/playlist";
import {useUser} from "../context/UserContext"; // useUserフックをインポート

interface PlaylistDisplayProps {
    playlists: Playlist[];
    selectedPlaylistId: string | null;
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             playlists,
                                                             selectedPlaylistId,
                                                             userId,
                                                             onPlaylistClick,
                                                         }) => {
    const {isLoggedIn} = useUser(); // ContextからisLoggedInを取得
    
    return (
        <>
            {playlists.length > 0 && !selectedPlaylistId && (
                <PlaylistTable
                    playlists={playlists}
                    onPlaylistClick={onPlaylistClick}
                    totalPlaylists={playlists.length}
                    currentPage={1}
                />
            )}
            
            {selectedPlaylistId && (
                <PlaylistDetailsLoader
                    playlistId={selectedPlaylistId}
                    userId={userId}
                />
            )}
            
            {isLoggedIn && <FollowedPlaylists onPlaylistClick={onPlaylistClick}/>}
        </>
    );
};

export default PlaylistDisplay;
