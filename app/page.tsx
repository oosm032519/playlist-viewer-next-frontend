import PlaylistSearch from './components/PlaylistSearch'

export default function Home() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Playlist Viewer</h1>
            <PlaylistSearch/>
        </main>
    )
}
