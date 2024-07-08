import {createColumnHelper} from "@tanstack/react-table";
import {Track} from "../types/track";
import {audioFeatureSort} from "./tableUtils";
import Image from "next/image";

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

const columnHelper = createColumnHelper<Track>();

export const playlistDetailsTableColumns = [
    columnHelper.accessor("album", {
        header: "Album",
        cell: (info) => (
            <Image src={info.getValue().images[0].url} alt={info.getValue().name} width={50} height={50}/>
        ),
        enableSorting: false,
    }),
    columnHelper.accessor("name", {
        header: "Title",
    }),
    columnHelper.accessor("artists", {
        header: "Artist",
        cell: (info) => <span>{info.getValue()[0].name}</span>,
    }),
    ...(["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"] as AudioFeature[]).map((feature) =>
        columnHelper.accessor((row) => row.audioFeatures?.[feature], {
            id: feature,
            header: feature.charAt(0).toUpperCase() + feature.slice(1),
            sortingFn: (a, b) => audioFeatureSort(a, b, feature),
            cell: (info) => info.getValue()?.toFixed(3) ?? "-",
        })
    ),
    columnHelper.accessor((row) => row.audioFeatures?.mode, {
        id: "mode",
        header: "Mode",
        sortingFn: (a, b) => {
            const modeA = a.original.audioFeatures?.mode ?? "";
            const modeB = b.original.audioFeatures?.mode ?? "";
            return modeA.localeCompare(modeB);
        },
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("durationMs", {
        header: "Duration (ms)",
        sortingFn: (a, b) => (a.original.durationMs || 0) - (b.original.durationMs || 0),
        cell: (info) => info.getValue()?.toString() ?? "-",
    }),
    columnHelper.accessor((row) => row.audioFeatures?.timeSignature, {
        id: "timeSignature",
        header: "Time Signature",
        sortingFn: (a, b) => audioFeatureSort(a, b, 'timeSignature'),
        cell: (info) => info.getValue()?.toString() ?? "-",
    }),
];
