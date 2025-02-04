// app/lib/PlaylistDetailsTableColumns.tsx
import {Tooltip, TooltipContent, TooltipTrigger} from '@/app/components/ui/tooltip'
import {createColumnHelper} from "@tanstack/react-table";
import {Track} from "@/app/types/track";
import {audioFeatureSort} from "@/app/lib/tableUtils";
import Image from "next/image";
import DOMPurify from 'dompurify';


// AudioFeature型を定義し、使用可能なオーディオフィーチャーを列挙
type AudioFeature =
    | "danceability"
    | "energy"
    | "key"
    | "loudness"
    | "speechiness"
    | "acousticness"
    | "instrumentalness"
    | "liveness"
    | "valence"
    | "tempo";

const columnHelper = createColumnHelper<Track>();

/**
 * keyを文字列に変換する関数
 * @param key - 音楽のキーを表す数値（0〜11）
 * @returns キーを表す文字列（例: "C", "D#", など）
 */
export const keyToString = (key: number | undefined): string => {
    if (key === undefined) return "-";
    const keyMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return keyMap[key] || "-";
};

/**
 * ミリ秒を"分:秒"形式に変換する関数
 * @param ms - ミリ秒単位の時間
 * @returns "分:秒"形式の文字列
 */
export const msToMinutesAndSeconds = (ms: number | undefined): string => {
    if (ms === undefined) return "-";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

/**
 * プレイリストの詳細テーブルのカラム定義
 */
export const playlistDetailsTableColumns = [
    // アルバムカラムの定義
    columnHelper.accessor("album", {
        header: "Album",
        cell: (info) => {
            const album = info.getValue();
            
            // album, album.images, album.images[0] が存在することを確認
            if (!album || !album.images || !album.images[0]) {
                return "-";
            }
            
            const albumImageUrl = album.images[0].url;
            const albumName = album.name;
            
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={album.externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                            <div className="w-12 h-12 relative">
                                <Image
                                    src={albumImageUrl}
                                    alt={albumName}
                                    className="object-contain w-full h-full"
                                    width={60}
                                    height={60}
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="pointer-events-none">
                        <p>{albumName}</p>
                    </TooltipContent>
                </Tooltip>
            );
        },
        enableSorting: false,
    }),
    // タイトルカラムの定義
    columnHelper.accessor("name", {
        header: "Title",
        cell: (info) => (
            <a href={info.row.original.externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                <span>{DOMPurify.sanitize(info.getValue())}</span>
            </a>
        ),
    }),
    // アーティストカラムの定義
    columnHelper.accessor("artists", {
        header: "Artist",
        cell: (info) => (
            <a href={info.getValue()[0].externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                <span>{DOMPurify.sanitize(info.getValue()[0].name)}</span>
            </a>
        ),
    }),
    // 各オーディオフィーチャーのカラムを動的に生成
    ...(["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"] as AudioFeature[]).map((feature) =>
        columnHelper.accessor((row) => row.audioFeatures?.[feature], {
            id: feature,
            header: feature.charAt(0).toUpperCase() + feature.slice(1), // ヘッダーをキャピタライズ
            sortingFn: (a, b) => audioFeatureSort(a, b, feature), // カスタムソート関数を使用
            cell: (info) => {
                // keyの場合は文字列に変換
                if (feature === "key") {
                    return keyToString(info.getValue());
                }
                return info.getValue()?.toFixed(3) ?? "-"; // 小数点以下3桁にフォーマット
            },
        })
    ),
    
    // モードカラムの定義
    columnHelper.accessor((row) => row.audioFeatures?.mode, {
        id: "mode",
        header: "Mode",
        sortingFn: (a, b) => {
            const modeA = a.original.audioFeatures?.mode ?? "";
            const modeB = b.original.audioFeatures?.mode ?? "";
            return modeA.localeCompare(modeB); // 文字列としてソート
        },
        cell: (info) => info.getValue() ?? "-", // 値がない場合はハイフンを表示
    }),
    
    // 再生時間カラムの定義
    columnHelper.accessor("durationMs", {
        header: "Duration",
        sortingFn: (a, b) => (a.original.durationMs || 0) - (b.original.durationMs || 0), // 数値としてソート
        cell: (info) => msToMinutesAndSeconds(info.getValue()), // "分:秒"形式に変換して表示
    }),
    
    // タイムシグネチャーカラムの定義
    columnHelper.accessor((row) => row.audioFeatures?.timeSignature, {
        id: "timeSignature",
        header: "Time Signature",
        sortingFn: (a, b) => audioFeatureSort(a, b, "timeSignature"), // カスタムソート関数を使用
        cell: (info) => info.getValue()?.toString() ?? "-", // 値がない場合はハイフンを表示
    }),
];
