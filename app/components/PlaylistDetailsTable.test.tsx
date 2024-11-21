// app/components/PlaylistDetailsTable.test.tsx

import {render, screen, fireEvent} from "@testing-library/react";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";
import {Track} from "@/app/types/track";
import {AudioFeatures} from "@/app/types/audioFeatures";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {expect} from "@jest/globals";

// モックデータ
const mockTracks: Track[] = [
    {
        album: {
            albumGroup: null,
            albumType: "album",
            artists: [
                {
                    externalUrls: {
                        externalUrls: {
                            spotify: "https://spotify.com/artist1"
                        },
                    },
                    href: "https://api.spotify.com/v1/artists/artist1",
                    id: "artist1",
                    name: "Artist 1",
                    type: "artist",
                    uri: "spotify:artist:artist1",
                },
            ],
            availableMarkets: ["JP", "US"],
            externalUrls: {
                externalUrls: {
                    spotify: "https://spotify.com/album1"
                    }
                },
            href: "https://api.spotify.com/v1/albums/album1",
            id: "album1",
            images: [
                {url: "https://image1.jpg", height: 640, width: 640},
                {url: "https://image2.jpg", height: 300, width: 300},
                {url: "https://image3.jpg", height: 64, width: 64},
            ],
            name: "Album 1",
            releaseDate: "2022-01-01",
            releaseDatePrecision: "day",
            restrictions: null,
            type: "album",
            uri: "spotify:album:album1",
        },
        artists: [
            {
                externalUrls: {
                    externalUrls: {
                        spotify: "https://spotify.com/artist1"
                    }
                },
                href: "https://api.spotify.com/v1/artists/artist1",
                id: "artist1",
                name: "Artist 1",
                type: "artist",
                uri: "spotify:artist:artist1",
            },
        ],
        availableMarkets: ["JP", "US"],
        discNumber: 1,
        durationMs: 1000,
        externalIds: {isrc: "US1234567890"},
        externalUrls: {
            externalUrls: {
                spotify: "https://spotify.com/track1"
            }
            },
        href: "https://api.spotify.com/v1/tracks/track1",
        id: "1",
        isExplicit: false,
        isPlayable: true,
        linkedFrom: null,
        name: "Track 1",
        popularity: 80,
        previewUrl: "https://preview.track1.mp3",
        restrictions: null,
        trackNumber: 1,
        type: "track",
        uri: "spotify:track:1",
        audioFeatures: {
            acousticness: 0.8,
            danceability: 0.7,
            energy: 0.6,
            instrumentalness: 0.0,
            liveness: 0.1,
            speechiness: 0.05,
            valence: 0.9,
            analysisUrl: "https://api.spotify.com/v1/audio-analysis/track1",
            durationMs: 1000,
            id: "1",
            key: 5,
            loudness: -5.0,
            mode: "major",
            tempo: 120,
            timeSignature: 4,
            trackHref: "https://api.spotify.com/v1/tracks/track1",
            type: "audio_features",
            uri: "spotify:track:1",
        },
    },
    {
        album: {
            albumGroup: null,
            albumType: "single",
            artists: [
                {
                    externalUrls: {
                        externalUrls: {
                            spotify: "https://spotify.com/artist2"
                        }
                    },
                    href: "https://api.spotify.com/v1/artists/artist2",
                    id: "artist2",
                    name: "Artist 2",
                    type: "artist",
                    uri: "spotify:artist:artist2",
                },
            ],
            availableMarkets: ["JP", "US"],
            externalUrls: {
                externalUrls: {
                    spotify: "https://spotify.com/album2"
                }
                },
            href: "https://api.spotify.com/v1/albums/album2",
            id: "album2",
            images: [
                {url: "https://imageA1.jpg", height: 640, width: 640},
                {url: "https://imageA2.jpg", height: 300, width: 300},
                {url: "https://imageA3.jpg", height: 64, width: 64},
            ],
            name: "Album 2",
            releaseDate: "2023-06-15",
            releaseDatePrecision: "day",
            restrictions: null,
            type: "album",
            uri: "spotify:album:album2",
        },
        artists: [
            {
                externalUrls: {
                    externalUrls: {
                        spotify: "https://spotify.com/artist2"
                    }
                    },
                href: "https://api.spotify.com/v1/artists/artist2",
                id: "artist2",
                name: "Artist 2",
                type: "artist",
                uri: "spotify:artist:artist2",
            },
        ],
        availableMarkets: ["JP", "US"],
        discNumber: 1,
        durationMs: 2000,
        externalIds: {isrc: "US9876543210"},
        externalUrls: {
            externalUrls: {
                spotify: "https://spotify.com/track2"
            }
            },
        href: "https://api.spotify.com/v1/tracks/track2",
        id: "2",
        isExplicit: false,
        isPlayable: true,
        linkedFrom: null,
        name: "Track 2",
        popularity: 70,
        previewUrl: "https://preview.track2.mp3",
        restrictions: null,
        trackNumber: 1,
        type: "track",
        uri: "spotify:track:2",
        audioFeatures: {
            acousticness: 0.4,
            danceability: 0.6,
            energy: 0.7,
            instrumentalness: 0.1,
            liveness: 0.2,
            speechiness: 0.1,
            valence: 0.8,
            analysisUrl: "https://api.spotify.com/v1/audio-analysis/track2",
            durationMs: 2000,
            id: "2",
            key: 7,
            loudness: -4.5,
            mode: "minor",
            tempo: 130,
            timeSignature: 4,
            trackHref: "https://api.spotify.com/v1/tracks/track2",
            type: "audio_features",
            uri: "spotify:track:2",
        },
    },
];

const mockAverageAudioFeatures: AudioFeatures = {
    acousticness: 0.6,
    danceability: 0.65,
    energy: 0.65,
    instrumentalness: 0.05,
    liveness: 0.15,
    speechiness: 0.075,
    valence: 0.85,
};

// QueryClientのインスタンスを作成
const queryClient = new QueryClient();

// テスト用のラッパーコンポーネント
const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

jest.mock("../lib/PlaylistDetailsTableColumns", () => ({
    playlistDetailsTableColumns: [
        {
            accessorKey: "name",
            header: "Name",
            cell: (info: any) => info.getValue(),
        },
    ],
}));

describe("PlaylistDetailsTable", () => {
    it("renders table with tracks", () => {
        renderWithQueryClient(
            <PlaylistDetailsTable
                tracks={mockTracks}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={() => {
                }}
                playlistName="Test Playlist"
            />
        );
        
        // トラック名が表示されていることを確認
        expect(screen.getByText("Track 1")).toBeInTheDocument();
        expect(screen.getByText("Track 2")).toBeInTheDocument();
    });
    
    it("calls onTrackSelect when a row is clicked", () => {
        const handleTrackSelect = jest.fn();
        
        renderWithQueryClient(
            <PlaylistDetailsTable
                tracks={mockTracks}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={handleTrackSelect}
                playlistName="Test Playlist"
            />
        );
        
        // 1行目をクリック
        fireEvent.click(screen.getByText("Track 1").closest("tr")!);
        
        // onTrackSelectが正しい引数で呼び出されたことを確認
        expect(handleTrackSelect).toHaveBeenCalledWith(mockTracks[0]);
    });
    
    it("displays a message when no tracks are available", () => {
        renderWithQueryClient(
            <PlaylistDetailsTable
                tracks={[]}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={() => {
                }}
                playlistName="Test Playlist"
            />
        );
        
        // メッセージが表示されていることを確認
        expect(screen.getByText("このプレイリストには曲が含まれていません")).toBeInTheDocument();
    });
});
