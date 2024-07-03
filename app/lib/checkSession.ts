// app/lib/checkSession.ts

export const checkSession = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/session/check', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.status === 'success';
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return false;
    }
};
