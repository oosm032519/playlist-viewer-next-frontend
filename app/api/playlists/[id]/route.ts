import {NextResponse} from 'next/server';

// バックエンドAPIのベースURLを取得するヘルパー関数
const getBackendUrl = () => {
    return process.env.BACKEND_URL || 'http://localhost:8080';
};

// プレイリストデータを取得するヘルパー関数
const fetchPlaylistData = async (id: string) => {
    const backendUrl = getBackendUrl();
    const fullUrl = `${backendUrl}/api/playlists/${id}`;
    
    try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }
        
        const textData = await response.text();
        
        try {
            return JSON.parse(textData);
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
        const data = await fetchPlaylistData(id);
        console.log('パースされたデータ:', data);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error: "プレイリストの取得に失敗しました"}, {status: 500});
    }
}
