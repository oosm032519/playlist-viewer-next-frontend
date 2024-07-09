import PlaylistTable from "./PlaylistTable";
import PlaylistDetailsLoader from "./PlaylistDetailsLoader";
import FollowedPlaylists from "./FollowedPlaylists";
import {Playlist} from "../types/playlist";

interface PlaylistDisplayProps {
    playlists: Playlist[];
    selectedPlaylistId: string | null;
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
    isLoggedIn: boolean;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             playlists,
                                                             selectedPlaylistId,
                                                             userId,
                                                             onPlaylistClick,
                                                             isLoggedIn,
                                                         }) => (
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

export default PlaylistDisplay;
