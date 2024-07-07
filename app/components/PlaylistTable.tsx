// PlaylistTable.tsx
import {Playlist} from "../types/playlist";
import {Table, TableBody} from "./ui/table";
import PlaylistTableHeader from "./PlaylistTableHeader";
import PlaylistTableRow from "./PlaylistTableRow";

interface PlaylistTableProps {
    playlists: Playlist[];
    onPlaylistClick: (playlistId: string) => void;
}

export default function PlaylistTable({playlists, onPlaylistClick}: PlaylistTableProps) {
    return (
        <Table>
            <PlaylistTableHeader/>
            <TableBody>
                {playlists.map((playlist) => (
                    <PlaylistTableRow
                        key={playlist.id}
                        playlist={playlist}
                        onClick={() => onPlaylistClick(playlist.id)}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
