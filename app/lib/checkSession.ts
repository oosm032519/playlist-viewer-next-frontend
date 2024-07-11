// app/lib/checkSession.ts

/**
 * サーバーにセッションの有効性を確認するための非同期関数
 * @returns {Promise<boolean>} セッションが有効であればtrue、無効であればfalseを返す
 */
export const checkSession = async (): Promise<boolean> => {
    try {
        // セッションの有効性を確認するためのAPIエンドポイントにリクエストを送信
        const response = await fetch('/api/session/check', {
            credentials: 'include' // クッキーを含めるための設定
        });
        // レスポンスをJSON形式に変換
        const data = await response.json();
        // セッションが有効かどうかを判定し、結果を返す
        return data.status === 'success';
    } catch (error) {
        // エラーハンドリング: エラーが発生した場合、エラーメッセージをコンソールに出力し、falseを返す
        console.error('セッションチェックエラー:', error);
        return false;
    }
};
