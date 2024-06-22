'use client'

import {useState} from 'react'
import axios from 'axios'

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

export default function PlaylistSearch() {
    const [query, setQuery] = useState('')
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    
    const searchPlaylists = async () => {
        try {
            const response = await axios.get(`/api/playlists/search?query=${query}`)
            setPlaylists(response.data)
        } catch (error) {
            console.error('Error searching playlists:', error)
        }
    }
    
    return (
        <div>
            <div className="mb-4 flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter playlist name"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    onClick={searchPlaylists}
                    className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Image</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Description</th>
                </tr>
                </thead>
                <tbody>
                {playlists.map((playlist) => (
                    <tr key={playlist.id}>
                        <td className="border p-2">
                            <img src={playlist.images[0]?.url} alt={playlist.name} className="w-12 h-12"/>
                        </td>
                        <td className="border p-2">{playlist.name}</td>
                        <td className="border p-2">{playlist.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
