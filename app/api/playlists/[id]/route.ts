// app/api/playlists/[id]/route.ts

import {NextResponse} from 'next/server';

// バックエンドAPIのベースURLを取得するヘルパー関数
const getBackendUrl = () => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    console.log(`バックエンドURL: ${backendUrl}`); // バックエンドURLをログ出力
    return backendUrl;
};

// プレイリストデータを取得するヘルパー関数
const fetchPlaylistData = async (id: string) => {
    const backendUrl = getBackendUrl();
    const fullUrl = `${backendUrl}/api/playlists/${id}`;
    console.log(`フルURL: ${fullUrl}`); // 完全なURLをログ出力
    
    try {
        console.log(`フェッチを開始: ${fullUrl}`); // フェッチ開始をログ出力
        const response = await fetch(fullUrl);
        console.log(`レスポンスステータス: ${response.status}`); // レスポンスステータスをログ出力
        
        if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }
        
        const textData = await response.text();
        console.log(`レスポンステキスト: ${textData}`); // レスポンステキストをログ出力
        
        try {
            const jsonData = JSON.parse(textData);
            console.log(`パースされたJSON: ${JSON.stringify(jsonData)}`); // パースされたJSONをログ出力
            return jsonData;
        } catch (parseError) {
            console.error('レスポンスをJSONとしてパースできませんでした:', parseError);
            throw new Error('レスポンスのパースに失敗しました');
        }
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
        console.log(`fetchPlaylistData関数を呼び出し: ID = ${id}`); // fetchPlaylistData関数の呼び出しをログ出力
        const data = await fetchPlaylistData(id);
        console.log('取得されたデータ:', data);
        console.log('NextResponseを作成中...'); // NextResponse作成をログ出力
        const response = new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
        console.log('NextResponseが作成されました'); // NextResponse作成完了をログ出力
        return response;
    } catch (error) {
        console.error("プレイリストの取得に失敗しました:", error);
        console.log('エラーレスポンスを作成中...'); // エラーレスポンス作成をログ出力
        const errorResponse = new NextResponse(JSON.stringify({error: "プレイリストの取得に失敗しました"}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
        console.log('エラーレスポンスが作成されました'); // エラーレスポンス作成完了をログ出力
        return errorResponse;
    }
}
