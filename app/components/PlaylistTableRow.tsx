// PlaylistTableRow.tsx
import {Playlist} from "../types/playlist";
import {TableCell, TableRow} from "./ui/table";

interface PlaylistTableRowProps {
    playlist: Playlist;
    onClick: () => void;
}

export default function PlaylistTableRow({playlist, onClick}: PlaylistTableRowProps) {
    return (
        <TableRow onClick={onClick}>
            <TableCell>
                {playlist.images[0]?.url ? (
                    <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-12 h-12 object-cover rounded-full"
                        width={48}
                        height={48}
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full" data-testid="image-placeholder"></div>
                )}
            </TableCell>
            <TableCell>{playlist.name}</TableCell>
            <TableCell>{playlist.tracks.total}</TableCell>
        </TableRow>
    );
}
