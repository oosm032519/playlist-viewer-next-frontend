// app/lib/tableUtils.ts

import {Row} from '@tanstack/react-table';
import {Track} from '../types/track';

type AudioFeature = keyof NonNullable<Track['audioFeatures']>;

export const audioFeatureSort = (
    a: Row<Track>,
    b: Row<Track>,
    accessorKey: AudioFeature
) => {
    const aValue = a.original.audioFeatures?.[accessorKey];
    const bValue = b.original.audioFeatures?.[accessorKey];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
    }
    
    // 文字列の場合（modeなど）
    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
    }
    
    // それ以外の場合（エラー防止のため）
    return 0;
};
