// app/types/recommendationsTableProps.ts

import {Track} from './track';

/**
 * @interface RecommendationsTableProps
 * おすすめ楽曲テーブルに渡すプロパティのインターフェース。
 *
 * @property {Track[]} tracks - 表示するトラックのリスト。`Track`型の配列。
 * @property {string} ownerId - プレイリストの所有者のID。
 * @property {string} userId - 現在ログインしているユーザーのID。
 * @property {string} playlistId - 関連するプレイリストのID。
 */
export interface RecommendationsTableProps {
    tracks: Track[];
    ownerId: string;
    userId: string;
    playlistId: string;
}
