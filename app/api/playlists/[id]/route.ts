import {NextResponse} from 'next/server';

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    console.log('GET関数が呼び出されました');
    console.log(`リクエストパラメータ: ${JSON.stringify(params)}`);
    
    const id = params.id;
    console.log(`プレイリストID: ${id}`);
    
    try {
        console.log('バックエンドURLの取得を開始します');
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        console.log(`バックエンドURL: ${backendUrl}`);
        
        const fullUrl = `${backendUrl}/api/playlists/${id}`;
        console.log(`完全なリクエストURL: ${fullUrl}`);
        
        console.log('バックエンドへのリクエストを開始します');
        const response = await fetch(fullUrl);
        console.log('バックエンドからのレスポンスを受信しました');
        
        console.log(`レスポンスステータス: ${response.status}`);
        
        if (!response.ok) {
            console.log('レスポンスがエラーを示しています');
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }
        
        console.log('レスポンスの本文をテキストとして読み取ります');
        const textData = await response.text();
        console.log('生のレスポンス:', textData);
        
        console.log('レスポンスをJSONとしてパースを試みます');
        let data;
        try {
            data = JSON.parse(textData);
            console.log('JSONパースに成功しました');
        } catch (parseError) {
            console.error('レスポンスをJSONとしてパースできませんでした:', parseError);
            console.log('テキストデータをそのまま返します');
            return NextResponse.json({message: textData});
        }
        
        console.log('パースされたデータ:', data);
        
        console.log('正常なレスポンスを返します');
        return NextResponse.json(data);
    } catch (error) {
        console.error("プレイリストの取得中にエラーが発生しました:", error);
        console.log('エラーレスポンスを返します');
        return NextResponse.json({error: "プレイリストの取得に失敗しました"}, {status: 500});
    }
}
