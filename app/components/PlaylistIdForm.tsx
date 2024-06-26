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
import LoadingSpinner from "./LoadingSpinner"; // 導入

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState("");
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false); // ローディング状態
    
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
        setIsLoading(true); // ローディング開始
        try {
            const response = await axios.get(`/api/playlists/${extractedId}`);
            console.log("PlaylistIdForm: API response:", response.data);
            // バックエンドから受け取ったaudio featureをtracksオブジェクトにマージ
            setTracks(response.data.tracks.items.map((item: any) => ({
                ...item.track,
                audioFeatures: item.audioFeatures
            })));
        } catch (error) {
            console.error("Error sending playlist ID:", error);
        } finally {
            setIsLoading(false); // ローディング終了
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
                    {tracks.length > 0 && <PlaylistDetails tracks={tracks}/>}
                </CardContent>
            </Card>
            <LoadingSpinner loading={isLoading}/> {/* ローディングアニメーションの表示 */}
        </>
    );
}
