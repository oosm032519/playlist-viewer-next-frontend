// PlaylistTableHeader.tsx
import {TableHead, TableHeader, TableRow} from "./ui/table";

export default function PlaylistTableHeader() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tracks</TableHead>
            </TableRow>
        </TableHeader>
    );
}
