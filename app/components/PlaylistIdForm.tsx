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

interface PlaylistIdFormProps {
    onPlaylistSelect: (playlistId: string) => Promise<void>;
}

const extractPlaylistIdFromUrl = (url: string): string | null => {
    const regex = /\/playlist\/([^?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export default ({onPlaylistSelect}: PlaylistIdFormProps) => {
    const [playlistId, setPlaylistId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
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
            await onPlaylistSelect(extractedId); // awaitを使用
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
