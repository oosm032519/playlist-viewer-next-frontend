// app/types/track.ts

import {Image} from '@/app/types/image';
import {TrackAudioFeatures} from '@/app/types/audioFeatures';

/**
 * 外部URL情報。
 */
export interface ExternalUrls {
    spotify: string;
}

/**
 * トラックのアーティスト情報。
 */
export interface TrackArtist {
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

/**
 * トラックが属するアルバム情報。
 */
export interface TrackAlbum {
    albumGroup: string | null;
    albumType: string;
    artists: TrackArtist[];
    availableMarkets: string[];
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    releaseDate: string;
    releaseDatePrecision: string;
    restrictions: any | null;
    type: string;
    uri: string;
}

/**
 * トラック情報。
 */
export interface Track {
    album: TrackAlbum;
    artists: TrackArtist[];
    availableMarkets: string[];
    discNumber: number;
    durationMs: number;
    externalIds: { isrc: string };
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    isExplicit: boolean;
    isPlayable: boolean | null;
    linkedFrom: any | null;
    name: string;
    popularity: number;
    previewUrl: string | null;
    restrictions: any | null;
    trackNumber: number;
    type: string;
    uri: string;
    audioFeatures?: TrackAudioFeatures;
}

export type {TrackAudioFeatures};
