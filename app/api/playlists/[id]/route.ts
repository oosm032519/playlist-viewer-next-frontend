// app/api/playlists/[id]/route.ts

import {NextResponse} from 'next/server';

const BACKEND_URL = 'http://localhost:8080';

const fetchPlaylistData = async (id: string) => {
    const fullUrl = `${BACKEND_URL}/api/playlists/${id}`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        const response = await fetch(fullUrl);
        console.log(`レスポンスステータス: ${response.status}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`エラーステータス: ${response.status}`);
            console.error(`エラーデータ: ${JSON.stringify(errorData)}`);
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error("プレイリストの取得中にエラーが発生しました:", error);
        throw error;
    }
};

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    console.log('GET関数が呼び出されました');
    console.log(`リクエストパラメータ: ${JSON.stringify(params)}`);
    
    const id = params.id;
    console.log(`プレイリストID: ${id}`);
    
    try {
        console.log(`fetchPlaylistData関数を呼び出し: ID = ${id}`);
        const data = await fetchPlaylistData(id);
        console.log('取得されたデータ:', data);
        console.log('NextResponseを作成中...');
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        console.error("プレイリストの取得に失敗しました:", error);
        console.log('エラーレスポンスを作成中...');
        
        if (error instanceof Error && error.message.includes('HTTPエラー')) {
            const status = parseInt(error.message.split(': ')[1], 10);
            if (status === 404) {
                return NextResponse.json({error: "プレイリストが見つかりません"}, {status: 404});
            } else if (status === 500) {
                return NextResponse.json({error: "プレイリストの取得中にサーバーエラーが発生しました"}, {status: 500});
            }
        }
        
        return NextResponse.json({error: "プレイリストの取得中に予期せぬエラーが発生しました"}, {status: 500});
    }
}
