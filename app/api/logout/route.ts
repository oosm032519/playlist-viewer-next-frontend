// app/api/session/route.ts

import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://localhost:8080/api/logout', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            res.status(200).json({message: 'ログアウトしました'});
        } catch (error) {
            console.error('ログアウトエラー:', error);
            res.status(500).json({error: 'ログアウト中にエラーが発生しました'});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
