// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\PlaylistTable.tsx
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
    onPlaylistClick: (playlistId: string) => void; // 新しい props を追加
}

export default function PlaylistTable({playlists, onPlaylistClick}: PlaylistTableProps) { // props を更新
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {playlists.map((playlist) => (
                    <TableRow key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                        {/* クリックイベントを追加 */}
                        <TableCell>
                            <img
                                src={playlist.images[0]?.url}
                                alt={playlist.name}
                                className="w-12 h-12 rounded-full"
                                width={48}
                                height={48}
                            />
                        </TableCell>
                        <TableCell>{playlist.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
