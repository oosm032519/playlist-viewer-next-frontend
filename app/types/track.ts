// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\types\track.ts
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
        mode: number;
        speechiness: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        valence: number;
        tempo: number;
        timeSignature: number;
    };
}
