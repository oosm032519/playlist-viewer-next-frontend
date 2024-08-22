// app/lib/errors.test.ts

import {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError
} from './errors';
import {expect} from '@jest/globals';

describe('Custom Error Classes', () => {
    // ApiErrorクラスのテスト
    describe('ApiError', () => {
        it('should create an instance with correct properties', () => {
            const error = new ApiError(500, 'Internal Server Error', 'Detailed error message');
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ApiError);
            expect(error.name).toBe('ApiError');
            expect(error.status).toBe(500);
            expect(error.message).toBe('Internal Server Error');
            expect(error.details).toBe('Detailed error message');
        });
    });
    
    // NotFoundErrorクラスのテスト
    describe('NotFoundError', () => {
        it('should create an instance with correct properties', () => {
            const error = new NotFoundError('Resource not found', 'Item with ID 123 was not found');
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.name).toBe('NotFoundError');
            expect(error.status).toBe(404);
            expect(error.message).toBe('Resource not found');
            expect(error.details).toBe('Item with ID 123 was not found');
        });
    });
    
    // UnauthorizedErrorクラスのテスト
    describe('UnauthorizedError', () => {
        it('should create an instance with correct properties', () => {
            const error = new UnauthorizedError('Unauthorized access');
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toBeInstanceOf(UnauthorizedError);
            expect(error.name).toBe('UnauthorizedError');
            expect(error.status).toBe(401);
            expect(error.message).toBe('Unauthorized access');
            expect(error.details).toBeUndefined();
        });
    });
    
    // BadRequestErrorクラスのテスト
    describe('BadRequestError', () => {
        it('should create an instance with correct properties', () => {
            const error = new BadRequestError('Invalid input', 'Email is required');
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.name).toBe('BadRequestError');
            expect(error.status).toBe(400);
            expect(error.message).toBe('Invalid input');
            expect(error.details).toBe('Email is required');
        });
    });
    
    // ForbiddenErrorクラスのテスト
    describe('ForbiddenError', () => {
        it('should create an instance with correct properties', () => {
            const error = new ForbiddenError('Access denied');
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.name).toBe('ForbiddenError');
            expect(error.status).toBe(403);
            expect(error.message).toBe('Access denied');
            expect(error.details).toBeUndefined();
        });
    });
});
