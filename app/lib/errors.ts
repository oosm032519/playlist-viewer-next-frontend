// app/lib/errors.ts

/**
 * APIエラーを表す基本クラス。
 * すべてのAPIエラーはこのクラスを継承して作成される。
 * @extends {Error}
 */
class ApiError extends Error {
    /** HTTPステータスコード */
    status: number;
    
    /** エラーの詳細な説明（任意） */
    details?: string;
    
    /**
     * ApiErrorのコンストラクタ。
     * @param {number} status - HTTPステータスコード
     * @param {string} message - エラーメッセージ
     * @param {string} [details] - エラーの詳細な説明（任意）
     */
    constructor(status: number, message: string, details?: string) {
        super(message);
        this.name = 'ApiError'; // エラーの名前を設定
        this.status = status;
        this.details = details;
    }
}

/**
 * 404 Not Foundエラーを表すクラス。
 * リソースが見つからない場合に使用される。
 * @extends {ApiError}
 */
class NotFoundError extends ApiError {
    /**
     * NotFoundErrorのコンストラクタ。
     * @param {string} message - エラーメッセージ
     * @param {string} [details] - エラーの詳細な説明（任意）
     */
    constructor(message: string, details?: string) {
        super(404, message, details);
        this.name = 'NotFoundError'; // エラーの名前を設定
    }
}

/**
 * 401 Unauthorizedエラーを表すクラス。
 * 認証が必要である場合に使用される。
 * @extends {ApiError}
 */
class UnauthorizedError extends ApiError {
    /**
     * UnauthorizedErrorのコンストラクタ。
     * @param {string} message - エラーメッセージ
     * @param {string} [details] - エラーの詳細な説明（任意）
     */
    constructor(message: string, details?: string) {
        super(401, message, details);
        this.name = 'UnauthorizedError'; // エラーの名前を設定
    }
}

/**
 * 400 Bad Requestエラーを表すクラス。
 * リクエストが不正である場合に使用される。
 * @extends {ApiError}
 */
class BadRequestError extends ApiError {
    /**
     * BadRequestErrorのコンストラクタ。
     * @param {string} message - エラーメッセージ
     * @param {string} [details] - エラーの詳細な説明（任意）
     */
    constructor(message: string, details?: string) {
        super(400, message, details);
        this.name = 'BadRequestError'; // エラーの名前を設定
    }
}

/**
 * 403 Forbiddenエラーを表すクラス。
 * アクセス権がない場合に使用される。
 * @extends {ApiError}
 */
class ForbiddenError extends ApiError {
    /**
     * ForbiddenErrorのコンストラクタ。
     * @param {string} message - エラーメッセージ
     * @param {string} [details] - エラーの詳細な説明（任意）
     */
    constructor(message: string, details?: string) {
        super(403, message, details);
        this.name = 'ForbiddenError'; // エラーの名前を設定
    }
}

export {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError
};
