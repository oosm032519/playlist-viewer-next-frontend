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

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState("");
    const [tracks, setTracks] = useState<Track[]>([]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Submitted playlist ID:", playlistId);
        
        try {
            const response = await axios.get(`/api/playlists/${playlistId}`);
            console.log("PlaylistIdForm: API response:", response.data);
            // tracks.items ではなく tracks を参照するように修正
            setTracks(response.data.tracks.map((item: any) => item.track));
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
                {tracks.length > 0 && <PlaylistDetails tracks={tracks}/>}
            </CardContent>
        </Card>
    );
}
