import { Track } from './track';

export interface RecommendationsTableProps {
    tracks: Track[];
    ownerId: string;
    userId: string;
    playlistId: string;
}
