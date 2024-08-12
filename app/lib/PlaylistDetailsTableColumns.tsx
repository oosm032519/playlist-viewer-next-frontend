// app/lib/PlaylistDetailsTableColumns.tsx

import {createColumnHelper} from "@tanstack/react-table";
import {Track} from "../types/track";
import {audioFeatureSort} from "./tableUtils";
import Image from "next/image";

// AudioFeature型を定義し、使用可能なオーディオフィーチャーを列挙
type AudioFeature =
    | 'danceability'
    | 'energy'
    | 'key'
    | 'loudness'
    | 'speechiness'
    | 'acousticness'
    | 'instrumentalness'
    | 'liveness'
    | 'valence'
    | 'tempo';

// Track型に基づいてカラムヘルパーを作成
const columnHelper = createColumnHelper<Track>();

// keyを文字列に変換する関数
const keyToString = (key: number | undefined): string => {
    if (key === undefined) return "-";
    const keyMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return keyMap[key] || "-";
};

// ミリ秒を"分:秒"形式に変換する関数
const msToMinutesAndSeconds = (ms: number | undefined): string => {
    if (ms === undefined) return "-";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

// プレイリストの詳細テーブルのカラム定義
export const playlistDetailsTableColumns = [
    // アルバムカラムの定義
    columnHelper.accessor("album", {
        header: "Album",
        cell: (info) => (
            <Image src={info.getValue().images[0].url} alt={info.getValue().name} width={50} height={50}/>
        ),
        enableSorting: false, // ソートを無効化
    }),
    // タイトルカラムの定義
    columnHelper.accessor("name", {
        header: "Title",
    }),
    // アーティストカラムの定義
    columnHelper.accessor("artists", {
        header: "Artist",
        cell: (info) => <span>{info.getValue()[0].name}</span>,
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
        sortingFn: (a, b) => audioFeatureSort(a, b, 'timeSignature'), // カスタムソート関数を使用
        cell: (info) => info.getValue()?.toString() ?? "-", // 値がない場合はハイフンを表示
    }),
];
