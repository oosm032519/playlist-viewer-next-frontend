// app/types/track.ts

export interface TrackArtist {
    externalUrls: any;
    name: string;
}

export interface TrackAlbum {
    externalUrls: any;
    name: string;
    images: { url: string }[];
}

export interface Track {
    previewUrl: string | undefined;
    id: string | null | undefined;
    name: string;
    artists: TrackArtist[];
    album: TrackAlbum;
    durationMs: number;
    audioFeatures?: {
        danceability: number;
        energy: number;
        key: number;
        loudness: number;
        mode: string;
        speechiness: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        valence: number;
        tempo: number;
        timeSignature: number;
    };
    externalUrls: {
        externalUrls: {
            spotify: string;
        }
    }
}
