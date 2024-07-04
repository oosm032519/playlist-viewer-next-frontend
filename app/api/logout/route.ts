import {NextRequest, NextResponse} from 'next/server';
import axios, {AxiosError} from 'axios';

const logout = async (req: NextRequest) => {
    console.log('logout関数が呼び出されました'); // 関数の開始をログ出力
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/logout'); // リクエスト送信前のログ
        console.log('リクエストヘッダー:', req.headers.get('cookie')); // Cookieヘッダーの内容をログ出力
        
        const response = await axios.post('http://localhost:8080/api/logout', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        
        console.log('APIレスポンスを受信しました:', response.status); // レスポンスのステータスコードをログ出力
        console.log('レスポンスデータ:', response.data); // レスポンスデータをログ出力
        
        return response.data;
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error); // エラーの詳細をログ出力
        
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Axiosエラーの詳細:', axiosError.response?.data); // Axiosエラーの詳細をログ出力
            throw new Error(`ログアウト失敗: ${axiosError.message}`);
        }
        throw new Error('ログアウト失敗: 不明なエラー');
    }
};

export async function POST(req: NextRequest) {
    try {
        await logout(req)
        const response = NextResponse.json({message: 'ログアウトしました'}, {status: 200});
        
        // セッションクッキーを削除
        response.cookies.delete('JSESSIONID');
        
        return response;
    } catch (error) {
        console.error('POSTハンドラーでエラーが発生しました:', error);
        return NextResponse.json({error: 'ログアウト中にエラーが発生しました'}, {status: 500});
    }
}
