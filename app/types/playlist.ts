// app/types/playlist.ts

import {Track, TrackAudioFeatures} from '@/app/types/track';
import {AudioFeatures} from '@/app/types/audioFeatures';
import {Image} from '@/app/types/image';

/**
 * プレイリスト内のトラック情報。
 */
export interface PlaylistTrack {
    track: Track;
    audioFeatures?: TrackAudioFeatures;
}

/**
 * プレイリスト内のトラックリスト。
 */
export interface PlaylistTracks {
    items: PlaylistTrack[];
}

/**
 * プレイリスト全体の情報。
 */
export interface Playlist {
    totalDuration: number;
    ownerName: string;
    minAudioFeatures: AudioFeatures;
    maxAudioFeatures: AudioFeatures;
    averageAudioFeatures: AudioFeatures;
    seedArtists: string[];
    ownerId: string;
    tracks: PlaylistTracks;
    images: Image[];
    playlistName: string;
    genreCounts: Record<string, number>;
}
