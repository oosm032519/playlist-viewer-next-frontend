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
}

export default function PlaylistTable({playlists}: PlaylistTableProps) {
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
                    <TableRow key={playlist.id}>
                        <TableCell>
                            <img
                                src={playlist.images[0]?.url}
                                alt={playlist.name}
                                className="w-12 h-12 rounded-full"
                            />
                        </TableCell>
                        <TableCell>{playlist.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
