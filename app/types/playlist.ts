// app/types/playlist.ts

import {Track, TrackAudioFeatures} from '@/app/types/track'

export interface PlaylistImage {
    height: number;
    url: string;
    width: number;
}

export interface PlaylistTrack {
    track: Track;
    audioFeatures?: TrackAudioFeatures;
}

export interface PlaylistTracks {
    items: PlaylistTrack[];
}

export interface AudioFeatures {
    acousticness: number;
    liveness: number;
    tempo: number;
    valence: number;
    instrumentalness: number;
    danceability: number;
    speechiness: number;
    energy: number;
}


export interface Playlist {
    totalDuration: number,
    ownerName: string;
    minAudioFeatures: AudioFeatures;
    seedArtists: string[];
    ownerId: string;
    maxAudioFeatures: AudioFeatures;
    tracks: PlaylistTracks;
    images: PlaylistImage[];
    playlistName: string;
    averageAudioFeatures: AudioFeatures;
    genreCounts: { [key: string]: number };
}
