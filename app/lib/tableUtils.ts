// app/lib/tableUtils.ts

import {Row} from '@tanstack/react-table';
import {Track} from '@/app/types/track';

type AudioFeature = keyof NonNullable<Track['audioFeatures']>;

/**
 * 指定された音声特徴量に基づいて、Trackの行をソートする関数
 *
 * @param {Row<Track>} a - ソート対象の最初の行
 * @param {Row<Track>} b - ソート対象の2番目の行
 * @param {AudioFeature} accessorKey - ソートに使用する音声特徴量のキー
 * @returns {number} ソート順を示す数値。負の値はaがbより小さいことを示し、正の値はaがbより大きいことを示す。
 *
 */
export const audioFeatureSort = (
    a: Row<Track>,
    b: Row<Track>,
    accessorKey: AudioFeature
): number => {
    // a行とb行の音声特徴量の値を取得
    const aValue = a.original.audioFeatures?.[accessorKey];
    const bValue = b.original.audioFeatures?.[accessorKey];
    
    // 両方の値がundefinedの場合、同じとみなす
    if (aValue === undefined && bValue === undefined) return 0;
    // aの値がundefinedの場合、bが前に来るようにする
    if (aValue === undefined) return 1;
    // bの値がundefinedの場合、aが前に来るようにする
    if (bValue === undefined) return -1;
    
    // 両方の値が数値の場合、数値として比較
    if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
    }
    
    // 両方の値が文字列の場合、文字列として比較
    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
    }
    
    // それ以外の場合（エラー防止のため）、同じとみなす
    return 0;
};
