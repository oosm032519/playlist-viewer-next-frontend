// app/components/PlaylistIdForm.tsx
"use client";
import {useState} from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import axios from "axios";
import PlaylistDetails from "./PlaylistDetails";
import {Track} from "@/app/types/track";
import LoadingSpinner from "./LoadingSpinner";

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState("");
    const [tracks, setTracks] = useState<Track[]>([]);
    const [recommendations, setRecommendations] = useState<Track[]>([]); // 追加: おすすめ楽曲の状態変数
    const [isLoading, setIsLoading] = useState(false); // ローディング状態
    const [genreCounts, setGenreCounts] = useState<{ [genre: string]: number }>({}); // ジャンルごとの出現回数
    const [playlistName, setPlaylistName] = useState<string | null>(null); // プレイリスト名
    
    const extractPlaylistIdFromUrl = (url: string): string | null => {
        const regex = /\/playlist\/([^?]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const extractedId = extractPlaylistIdFromUrl(playlistId);
        console.log("Extracted Playlist ID:", extractedId);
        
        if (!extractedId) {
            console.error("Invalid Playlist URL:", playlistId);
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/playlists/${extractedId}`);
            console.log("PlaylistIdForm: API response:", response.data);
            setTracks(response.data.tracks.items.map((item: any) => ({
                ...item.track,
                audioFeatures: item.audioFeatures
            })));
            setGenreCounts(response.data.genreCounts);
            setRecommendations(response.data.recommendations);
            setPlaylistName(response.data.playlistName); // API レスポンスからプレイリスト名を設定
        } catch (error) {
            console.error("Error sending playlist ID:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <Card className="w-full max-w-4xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Enter Playlist URL</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter playlist URL"
                            value={playlistId}
                            onChange={(e) => setPlaylistId(e.target.value)}
                            disabled={isLoading} // ローディング中は無効化
                        />
                        <Button type="submit" disabled={isLoading}>
                            {/* ローディング中は無効化 */}
                            Submit
                        </Button>
                    </form>
                    {tracks.length > 0 && (
                        <>
                            {playlistName && <h2 className="text-2xl font-bold text-center mt-8">
                                {playlistName}
                            </h2>}
                            <PlaylistDetails tracks={tracks} genreCounts={genreCounts}
                                             recommendations={recommendations}/>
                        </>
                    )}
                </CardContent>
            </Card>
            <LoadingSpinner loading={isLoading}/> {/* ローディングアニメーションの表示 */}
        </>
    );
}
