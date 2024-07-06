// app/api/logout/route.ts

import {NextApiRequest, NextApiResponse} from 'next';
import axios, {AxiosError} from 'axios';

const logout = async (req: NextApiRequest) => {
    console.log('logout関数が呼び出されました'); // 関数の開始をログ出力
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/logout'); // リクエスト送信前のログ
        console.log('リクエストヘッダー:', req.headers.cookie); // Cookieヘッダーの内容をログ出力
        
        const response = await axios.post('http://localhost:8080/api/logout', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || '',
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
    
    try {
        await logout(req);
        res.status(200).json({message: 'ログアウトしました'});
    } catch (error) {
        console.error('POSTハンドラーでエラーが発生しました:', error);
        res.status(500).json({error: 'ログアウト中にエラーが発生しました'});
    }
}
