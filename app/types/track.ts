// app/types/track.ts
export interface TrackArtist {
    name: string;
}

export interface TrackAlbum {
    name: string;
}

export interface Track {
    name: string;
    artists: TrackArtist[];
    album: TrackAlbum;
}
