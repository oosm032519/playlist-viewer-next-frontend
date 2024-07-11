// app/components/PlaylistTableHeader.tsx

import {TableHead, TableHeader, TableRow} from "./ui/table";

/**
 * プレイリストのテーブルヘッダーを表示するコンポーネント
 * @returns テーブルヘッダーのJSX要素
 */
export default function PlaylistTableHeader() {
    return (
        <TableHeader>
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
