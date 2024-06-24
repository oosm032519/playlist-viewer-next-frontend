// PlaylistIdForm.tsx

"use client";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState('');
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Submitted playlist ID:", playlistId); // 入力されたIDをコンソールに出力
    };
    
    return (
        <Card className="w-full max-w-4xl mx-auto mt-8"> {/* 既存の検索フォームとスタイルを合わせる */}
            <CardHeader>
                <CardTitle>Enter Playlist ID</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter playlist ID"
                        value={playlistId}
                        onChange={(e) => setPlaylistId(e.target.value)}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}
