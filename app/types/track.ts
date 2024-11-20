// app/types/track.ts

export interface ExternalUrls {
    externalUrls: {
        spotify: string;
    };
}

export interface TrackArtist {
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface TrackAlbumImage {
    height: number;
    url: string;
    width: number;
}

export interface TrackAlbum {
    albumGroup: string | null;
    albumType: string;
    artists: TrackArtist[];
    availableMarkets: string[];
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    images: TrackAlbumImage[];
    name: string;
    releaseDate: string;
    releaseDatePrecision: string;
    restrictions: any | null;
    type: string;
    uri: string;
}

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

export interface TrackAudioFeatures {
    acousticness: number;
    analysisUrl: string;
    danceability: number;
    durationMs: number;
    energy: number;
    id: string;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: string;
    speechiness: number;
    tempo: number;
    timeSignature: number;
    trackHref: string;
    type: string;
    uri: string;
    valence: number;
}
