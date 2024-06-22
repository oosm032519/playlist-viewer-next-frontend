export interface PlaylistImage {
    url: string;
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    images: PlaylistImage[];
}
