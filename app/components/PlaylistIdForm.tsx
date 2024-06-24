// PlaylistIdForm.tsx

"use client";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import axios from "axios";

export default function PlaylistIdForm() {
    console.log("PlaylistIdForm コンポーネントがレンダリングされました");
    const [playlistId, setPlaylistId] = useState('');
    console.log("初期状態: playlistId =", playlistId);
    
    const handleSubmit = async (event: React.FormEvent) => {
        console.log("フォームが送信されました");
        event.preventDefault();
        console.log("送信されたプレイリストID:", playlistId);
        
        try {
            console.log("API リクエストを開始します");
            // API Routeを使用するように変更
            const response = await axios.get(`/api/playlists/${playlistId}`);
            console.log("API レスポンスを受信しました:", response.data);
            
            // プレイリストの中身をコンソールに出力
            console.log("プレイリストのトラック:", response.data.tracks);
            console.log("トラック数:", response.data.tracks.length);
        } catch (error) {
            console.error("プレイリストIDの送信中にエラーが発生しました:", error);
            if (axios.isAxiosError(error)) {
                console.error("エラーの詳細:", error.response?.data);
            }
        }
    };
    
    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Enter Playlist ID</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter playlist ID"
                        value={playlistId}
                        onChange={(e) => {
                            console.log("入力値が変更されました:", e.target.value);
                            setPlaylistId(e.target.value);
                        }}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}
