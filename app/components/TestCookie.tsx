"use client";

import {useState, useEffect} from 'react';
import {Button} from './ui/button';

const TestCookie = () => {
    const [cookieValue, setCookieValue] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    useEffect(() => {
        fetchCookie();
    }, []);
    
    const fetchCookie = async () => {
        try {
            const response = await fetch('/api/test-cookie', {
                credentials: 'include'
            });
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
    
    const sendCookie = async () => {
        try {
            const response = await fetch('/api/test-cookie', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                console.error('Cookieの送信に失敗しました。');
            }
        } catch (error) {
            console.error('Cookieの送信中にエラーが発生しました。', error);
        }
    };
    
    return (
        <div>
            <p>Cookie Value: {cookieValue}</p>
            <p>Message: {message}</p>
            <Button onClick={fetchCookie}>Cookieを取得</Button>
            <Button onClick={sendCookie}>Cookieを送信</Button>
        </div>
    );
};

export default TestCookie;
