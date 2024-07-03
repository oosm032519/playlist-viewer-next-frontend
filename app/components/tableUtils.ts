// tableUtils.ts

// オーディオ機能のソートタイプ関数を定義
export const audioFeatureSort = (
    a: { original: { audioFeatures: { [key: string]: number | undefined } } },
    b: { original: { audioFeatures: { [key: string]: number | undefined } } },
    accessorKey: string
) => {
    const aValue = a.original.audioFeatures?.[accessorKey];
    const bValue = b.original.audioFeatures?.[accessorKey];
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    return aValue - bValue;
};
