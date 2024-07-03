// app/lib/checkSession.ts

export const checkSession = async () => {
    try {
        const response = await fetch('/api/session', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.status === 'success';
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return false;
    }
};
