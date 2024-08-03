// app/lib/checkSession.ts

/**
 * セッションの有効性を確認するための関数
 * @returns {boolean} セッションが有効であればtrue、無効であればfalseを返す
 */
export const checkSession = (): boolean => {
    // セッションストレージからJWTを取得
    const jwt = sessionStorage.getItem('JWT');
    // JWTが存在すればセッションは有効とみなす
    return !!jwt;
};
