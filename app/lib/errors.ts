// app/lib/errors.ts

class ApiError extends Error {
    status: number;
    details?: string;
    
    constructor(status: number, message: string, details?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

class NotFoundError extends ApiError {
    constructor(message: string, details?: string) {
        super(404, message, details);
        this.name = 'NotFoundError'; // エラーの名前を設定
    }
}

class UnauthorizedError extends ApiError {
    constructor(message: string, details?: string) {
        super(401, message, details);
        this.name = 'UnauthorizedError'; // エラーの名前を設定
    }
}

class BadRequestError extends ApiError {
    constructor(message: string, details?: string) {
        super(400, message, details);
        this.name = 'BadRequestError'; // エラーの名前を設定
    }
}

class ForbiddenError extends ApiError {
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
