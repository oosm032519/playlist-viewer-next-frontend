// app/components/PlaylistDetailsTable.test.tsx

import {render, screen, fireEvent} from "@testing-library/react";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";
import {Track} from "@/app/types/track";
import {AudioFeatures} from "@/app/types/audioFeatures";
import {expect} from "@jest/globals";

// モックデータ
const mockTracks: Track[] = [
    {id: "1", name: "Track 1", artists: [{name: "Artist 1"}], album: {name: "Album 1"}, duration_ms: 1000, uri: "uri1"},
    {id: "2", name: "Track 2", artists: [{name: "Artist 2"}], album: {name: "Album 2"}, duration_ms: 2000, uri: "uri2"},
];

const mockAverageAudioFeatures: AudioFeatures = {
    acousticness: 0.5,
    danceability: 0.5,
    energy: 0.5,
    instrumentalness: 0.5,
    liveness: 0.5,
    loudness: 0.5,
    speechiness: 0.5,
    tempo: 100,
    valence: 0.5,
};

jest.mock("../lib/PlaylistDetailsTableColumns", () => ({
    playlistDetailsTableColumns: [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => info.getValue(),
        },
    ],
}));


describe("PlaylistDetailsTable", () => {
    it("renders table with tracks", () => {
        // コンポーネントをレンダリング
        render(
            <PlaylistDetailsTable
                tracks={mockTracks}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={() => {
                }}
            />
        );
        
        // トラック名が表示されていることを確認
        expect(screen.getByText("Track 1")).toBeInTheDocument();
        expect(screen.getByText("Track 2")).toBeInTheDocument();
    });
    
    it("calls onTrackSelect when a row is clicked", () => {
        // onTrackSelectのモック関数
        const handleTrackSelect = jest.fn();
        
        // コンポーネントをレンダリング
        render(
            <PlaylistDetailsTable
                tracks={mockTracks}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={handleTrackSelect}
            />
        );
        
        // 1行目をクリック
        fireEvent.click(screen.getByText("Track 1").closest("tr")!);
        
        // onTrackSelectが正しい引数で呼び出されたことを確認
        expect(handleTrackSelect).toHaveBeenCalledWith(mockTracks[0]);
    });
    
    it("displays a message when no tracks are available", () => {
        // 空のトラックリストでコンポーネントをレンダリング
        render(
            <PlaylistDetailsTable
                tracks={[]}
                averageAudioFeatures={mockAverageAudioFeatures}
                selectedTrack={null}
                onTrackSelect={() => {
                }}
            />
        );
        
        // メッセージが表示されていることを確認
        expect(screen.getByText("このプレイリストには曲が含まれていません")).toBeInTheDocument();
    });
});
