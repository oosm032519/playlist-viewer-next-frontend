// app/types/playlist.ts
import {Image} from '@/app/types/image'
import {ExternalUrls} from '@/app/types/externalUrls';

export interface PlaylistTrack {
    id: string;
    name: string;
    durationMs: number;
    album: {
        name: string;
        images: Image[];
        externalUrls: ExternalUrls;
    };
    artists: {
        name: string;
        externalUrls: ExternalUrls;
    }[];
    externalUrls: ExternalUrls;
    previewUrl: string | null;
    audioFeatures: {
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        mode: string;
        speechiness: number;
        tempo: number;
        timeSignature: number;
        valence: number;
        key: number;
    } | null; // null許容を維持
}


export interface PlaylistTracks {
    total: number;
}


export interface Playlist {
    id: string;
    name: string;
    images: Image[];
    tracks: PlaylistTracks;
    externalUrls: ExternalUrls;
    owner: {
        displayName: string;
    };
}
