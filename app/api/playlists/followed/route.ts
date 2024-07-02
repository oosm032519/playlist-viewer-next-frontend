// app/api/playlists/followed/route.ts

import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

const getFollowedPlaylists = async (req: NextRequest) => {
    try {
        const response = await axios.get('http://localhost:8080/api/playlists/followed', {
            withCredentials: true,
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching followed playlists:', error);
        throw error;
    }
};

export async function GET(req: NextRequest) {
    try {
        const playlists = await getFollowedPlaylists(req);
        return NextResponse.json(playlists);
    } catch (error) {
        return NextResponse.json({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'}, {status: 500});
    }
}
