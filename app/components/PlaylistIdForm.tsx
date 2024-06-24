// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\PlaylistIdForm.tsx

// PlaylistIdForm.tsx

"use client";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import axios from "axios";

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState('');
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Submitted playlist ID:", playlistId);
        
        try {
            // API Routeを使用するように変更
            const response = await axios.get(`/api/playlists/${playlistId}`);
            console.log("PlaylistIdForm: API response:", response.data);
            
            // プレイリストの中身をコンソールに出力
            console.log("Playlist tracks:", response.data.tracks);
        } catch (error) {
            console.error("Error sending playlist ID:", error);
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
                        onChange={(e) => setPlaylistId(e.target.value)}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}
