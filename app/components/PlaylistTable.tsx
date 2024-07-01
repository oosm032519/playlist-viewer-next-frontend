import {Playlist} from "@/app/types/playlist";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";

interface PlaylistTableProps {
    playlists: Playlist[];
    onPlaylistClick: (playlistId: string) => void; // プロパティとして追加
}

export default function PlaylistTable({playlists, onPlaylistClick}: PlaylistTableProps) {
    
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Tracks</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playlists.map((playlist) => (
                        <TableRow key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                        <TableCell>
                                <img
                                    src={playlist.images[0]?.url}
                                    alt={playlist.name}
                                    className="w-12 h-12 object-cover rounded-full"
                                    width={48}
                                    height={48}
                                />
                            </TableCell>
                            <TableCell>{playlist.name}</TableCell>
                            <TableCell>{playlist.tracks.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
