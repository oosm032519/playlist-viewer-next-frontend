// app/types/playlistDetails.ts
import {PlaylistTrack} from "@/app/types/playlist";
import {AudioFeatures} from "@/app/types/audioFeatures";

export interface PlaylistDetails {
    totalDuration: number;
    ownerName: string;
    minAudioFeatures: AudioFeatures;
    seedArtists: string[];
    ownerId: string;
    maxAudioFeatures: AudioFeatures;
    tracks: {
        items: PlaylistTrack[];
    };
    playlistName: string;
    averageAudioFeatures: AudioFeatures;
    genreCounts: Record<string, number>;
}
