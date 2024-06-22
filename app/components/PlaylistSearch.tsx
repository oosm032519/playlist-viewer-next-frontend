'use client'

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import {useState} from 'react'

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

interface SearchFormInputs {
    query: string;
}

const schema = yup.object({
    query: yup.string().required('検索クエリを入力してください').min(2, '最低2文字以上入力してください'),
}).required();

export default function PlaylistSearch() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    
    const {register, handleSubmit, formState: {errors}} = useForm<SearchFormInputs>({
        resolver: yupResolver(schema)
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        try {
            const response = await axios.get(`/api/playlists/search?query=${data.query}`);
            setPlaylists(response.data);
        } catch (error) {
            console.error('Error searching playlists:', error);
        }
    };
    
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex">
                <input
                    {...register('query')}
                    type="text"
                    placeholder="Enter playlist name"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
            {errors.query && <p className="text-red-500">{errors.query.message}</p>}
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
