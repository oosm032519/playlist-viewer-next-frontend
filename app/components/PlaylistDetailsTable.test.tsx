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
            externalUrls: {
                externalUrls: {
                    spotify: "https://spotify.com/album1"
                    }
                },
            images: [
                {url: "https://image1.jpg"},
                {url: "https://image2.jpg"},
                {url: "https://image3.jpg"},
            ],
            name: "Album 1",
        },
        artists: [
            {
                externalUrls: {
                    externalUrls: {
                        spotify: "https://spotify.com/artist1"
                    }
                },
                name: "Artist 1",
            },
        ],
        durationMs: 1000,
        externalUrls: {
            externalUrls: {
                spotify: "https://spotify.com/track1"
            }
            },
        id: "1",
        name: "Track 1",
        previewUrl: "https://preview.track1.mp3",
        audioFeatures: {
            acousticness: 0.8,
            danceability: 0.7,
            energy: 0.6,
            instrumentalness: 0.0,
            liveness: 0.1,
            speechiness: 0.05,
            valence: 0.9,
            durationMs: 1000,
            id: "1",
            key: 5,
            loudness: -5.0,
            mode: "MAJOR",
            tempo: 120,
            timeSignature: 4,
        },
    },
    {
        album: {
            externalUrls: {
                externalUrls: {
                    spotify: "https://spotify.com/album2"
                }
                },
            images: [
                {url: "https://imageA1.jpg"},
                {url: "https://imageA2.jpg"},
                {url: "https://imageA3.jpg"},
            ],
            name: "Album 2",
        },
        artists: [
            {
                externalUrls: {
                    externalUrls: {
                        spotify: "https://spotify.com/artist2"
                    }
                    },
                name: "Artist 2",
            },
        ],
        durationMs: 2000,
        externalUrls: {
            externalUrls: {
                spotify: "https://spotify.com/track2"
            }
            },
        id: "2",
        name: "Track 2",
        previewUrl: "https://preview.track2.mp3",
        audioFeatures: {
            acousticness: 0.4,
            danceability: 0.6,
            energy: 0.7,
            instrumentalness: 0.1,
            liveness: 0.2,
            speechiness: 0.1,
            valence: 0.8,
            durationMs: 2000,
            id: "2",
            key: 7,
            loudness: -4.5,
            mode: "MINOR",
            tempo: 130,
            timeSignature: 4,
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
    tempo: 125,
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
                selectedTrackId={null}
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
                selectedTrackId={null}
                onTrackSelect={handleTrackSelect}
                playlistName="Test Playlist"
            />
        );
        
        // 1行目をクリック
        fireEvent.click(screen.getByText("Track 1").closest("tr")!);
        
        // onTrackSelectが正しい引数で呼び出されたことを確認
        expect(handleTrackSelect).toHaveBeenCalledWith("1");
    });
    
    it("displays a message when no tracks are available", () => {
        renderWithQueryClient(
            <PlaylistDetailsTable
                tracks={[]}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrackId={null}
                onTrackSelect={() => {
                }}
                playlistName="Test Playlist"
            />
        );
        
        // メッセージが表示されていることを確認
        expect(screen.getByText("このプレイリストには曲が含まれていません")).toBeInTheDocument();
    });
});
