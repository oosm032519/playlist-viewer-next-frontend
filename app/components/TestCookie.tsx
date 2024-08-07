// app/components/TestCookie.tsx
"use client";

import {useState, useEffect} from 'react';
import {Button} from './ui/button';

const TestCookie = () => {
    const [cookieValue, setCookieValue] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchCookie = async () => {
            try {
                const response = await fetch('/api/test-cookie');
                if (response.ok) {
                    const data = await response.json();
                    setCookieValue(data.testCookie);
                } else {
                    console.error('Cookieの取得に失敗しました。');
                }
            } catch (error) {
                console.error('Cookieの取得中にエラーが発生しました。', error);
            }
        };
        
        fetchCookie();
    }, []);
    
    return (
        <div>
            <p>Cookie Value: {cookieValue}</p>
            <Button onClick={() => window.location.reload()}>リフレッシュ</Button>
        </div>
    );
};

export default TestCookie;
