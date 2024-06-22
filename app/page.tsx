import PlaylistSearch from './components/PlaylistSearch'

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-spotify-green">Playlist Viewer</h1>
            <PlaylistSearch/>
        </main>
    )
}
