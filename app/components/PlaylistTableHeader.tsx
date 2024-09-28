// app/components/PlaylistTableHeader.tsx

import {TableHead, TableHeader, TableRow} from "./ui/table";

interface PlaylistTableHeaderProps {
    totalPlaylists: number;
}

/**
 * プレイリストのテーブルヘッダーを表示するコンポーネント
 * @returns テーブルヘッダーのJSX要素
 */
export default function PlaylistTableHeader({
                                                totalPlaylists,
                                            }: PlaylistTableHeaderProps) {
    return (
        <TableHeader>
            <TableRow>
                <TableHead colSpan={3} className="text-center">
                    {`検索結果: ${totalPlaylists}件`}
                </TableHead>
            </TableRow>
            <TableRow>
                {/* 画像列のヘッダー */}
                <TableHead>Image</TableHead>
                {/* 名前列のヘッダー */}
                <TableHead>Name</TableHead>
                {/* トラック数列のヘッダー */}
                <TableHead>Tracks</TableHead>
            </TableRow>
        </TableHeader>
    );
}
