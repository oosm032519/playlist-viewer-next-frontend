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
import LoadingSpinner from "./LoadingSpinner";

export default function PlaylistIdForm() {
    const [playlistId, setPlaylistId] = useState("");
    const [extractedPlaylistId, setExtractedPlaylistId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
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
        setExtractedPlaylistId(extractedId);
        setIsLoading(false);
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
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <LoadingSpinner loading={isLoading}/>
        </>
    );
}
