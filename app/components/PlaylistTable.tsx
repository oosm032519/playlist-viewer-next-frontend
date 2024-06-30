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
    onPlaylistClick: (playlistId: string) => void;
}

export default function PlaylistTable({playlists, onPlaylistClick}: PlaylistTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Tracks</TableHead> {/* 新しい列ヘッダーを追加 */}
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
                        <TableCell>{playlist.tracks.total}</TableCell> {/* トラック数を表示する新しいセルを追加 */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
