import {useState, useEffect} from "react";
import {checkSession} from "../lib/checkSession";

export function useSession() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const initializeSession = async () => {
            const sessionStatus = await checkSession();
            setIsLoggedIn(sessionStatus);
            
            if (sessionStatus) {
                try {
                    const response = await fetch("/api/session/check", {
                        credentials: "include",
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.userId) {
                        setUserId(data.userId);
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("ユーザーIDの取得中にエラーが発生しました:", error.message, (error as any).code);
                        setError("ユーザーIDの取得中にエラーが発生しました。");
                    } else {
                        console.error("ユーザーIDの取得中にエラーが発生しました:", error);
                        setError("ユーザーIDの取得中にエラーが発生しました。");
                    }
                }
            }
        };
        initializeSession();
    }, []);
    
    return {isLoggedIn, userId, error};
}
