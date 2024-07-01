export interface PlaylistImage {
    url: string;
}

export interface Playlist {
    tracks: any;
    id: string;
    name: string;
    description: string;
    images: PlaylistImage[];
}
