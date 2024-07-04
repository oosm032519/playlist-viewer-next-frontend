// app/components/PlaylistIdForm.tsx
"use client";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import LoadingSpinner from "./LoadingSpinner";

// Alertコンポーネントをインポート
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // エラーメッセージの状態
    
    const mutation = useMutation({
        mutationFn: (extractedId: string) => onPlaylistSelect(extractedId),
        onError: (error) => {
            console.error("Error sending playlist ID:", error);
            // エラーメッセージを設定
            setErrorMessage("Invalid Playlist URL");
        },
    });
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const extractedId = extractPlaylistIdFromUrl(playlistId);
        console.log("Extracted Playlist ID:", extractedId);
        
        if (!extractedId) {
            console.error("Invalid Playlist URL:", playlistId);
            setErrorMessage("Invalid Playlist URL"); // エラーメッセージを設定
            return;
        }
        
        setErrorMessage(null); // エラーメッセージをクリア
        mutation.mutate(extractedId);
    };
    
    return (
        <>
            <Card className="w-full max-w-4xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Enter Playlist URL</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* エラーメッセージ表示領域 */}
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter playlist URL"
                            value={playlistId}
                            onChange={(e) => setPlaylistId(e.target.value)}
                            disabled={mutation.isPending}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <LoadingSpinner loading={mutation.isPending}/>
        </>
    );
}
