// app/types/recommendationsTableProps.ts

import {Track} from './track';

/**
 * おすすめ楽曲テーブルのプロパティ。
 */
export interface RecommendationsTableProps {
    tracks: Track[];
    ownerId: string;
    userId: string;
    playlistId: string;
}
