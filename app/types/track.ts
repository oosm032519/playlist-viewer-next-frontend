// app/types/track.ts
import {Album} from '@/app/types/album';
import {Artist} from '@/app/types/artist';
import {TrackAudioFeatures} from '@/app/types/audioFeatures';
import {ExternalUrls} from '@/app/types/externalUrls';


export interface Track {
    album: Album;
    artists: Artist[];
    durationMs: number;
    externalUrls: ExternalUrls;
    id: string;
    name: string;
    previewUrl: string | null;
    audioFeatures: TrackAudioFeatures | null;
}

export type {TrackAudioFeatures};
