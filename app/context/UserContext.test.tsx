// UserContext.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import {UserContextProvider, useUser} from './UserContext';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// グローバルなfetchのモック
global.fetch = jest.fn() as jest.Mock;

// sessionStorageのモック
const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'sessionStorage', {value: mockSessionStorage});

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('UserContextProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('初期状態で正しく描画される', async () => {
        mockSessionStorage.getItem.mockReturnValue(null);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({status: 'error', userId: null}),
        });
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            expect(screen.getByTestId('error')).toHaveTextContent('null');
        });
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        const {container} = render(
            <UserContextProvider>
                <div>Test content</div>
            </UserContextProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});

describe('セッションチェック', () => {
    it('セッションが有効な場合、正しく状態が更新される', async () => {
        mockSessionStorage.getItem.mockReturnValue('valid-jwt');
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({status: 'success', userId: 'test-user-id'}),
        });
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
            expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-id');
            expect(screen.getByTestId('error')).toHaveTextContent('null');
        });
    });
    
    it('セッションが無効な場合、正しく状態が更新される', async () => {
        mockSessionStorage.getItem.mockReturnValue(null);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({status: 'error', userId: null}),
        });
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            expect(screen.getByTestId('error')).toHaveTextContent('null');
        });
    });
});

describe('エラーハンドリング', () => {
    it('ユーザーID取得中にエラーが発生した場合、正しくエラー状態が設定される', async () => {
        mockSessionStorage.getItem.mockReturnValue('valid-jwt');
        (global.fetch as jest.Mock).mockRejectedValue(new Error('ユーザーID取得エラー'));
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            // エラーメッセージが変更されていることを確認
            expect(screen.getByTestId('error')).toHaveTextContent('ユーザーID取得エラー');
        });
    });
    
    it('HTTPエラーが発生した場合、正しくエラー状態が設定される', async () => {
        mockSessionStorage.getItem.mockReturnValue('valid-jwt');
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
        });
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            // エラーメッセージが変更されていることを確認
            expect(screen.getByTestId('error')).toHaveTextContent('HTTP error! status: 500');
        });
        
        expect(console.error).toHaveBeenCalledWith(
            'セッション初期化中にエラーが発生しました:',
            expect.any(Error)
        );
    });
    
    it('非Errorオブジェクトのエラーが発生した場合、正しくエラー状態が設定される', async () => {
        mockSessionStorage.getItem.mockReturnValue('valid-jwt');
        (global.fetch as jest.Mock).mockRejectedValue('非Errorオブジェクトのエラー');
        
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            // エラーメッセージが変更されていることを確認
            expect(screen.getByTestId('error')).toHaveTextContent('非Errorオブジェクトのエラー');
        });
        
        expect(console.error).toHaveBeenCalledWith(
            'セッション初期化中にエラーが発生しました:',
            '非Errorオブジェクトのエラー'
        );
    });
});

describe('useUser フック', () => {
    it('UserContextProvider の外で使用された場合にエラーをスローする', () => {
        const TestComponent = () => {
            useUser();
            return null;
        };
        
        expect(() => render(<TestComponent/>)).toThrow('useUser must be used within a UserContextProvider');
    });
    
    it('UserContextProvider 内で正しく動作する', () => {
        const TestComponent = () => {
            const {isLoggedIn, userId, error} = useUser();
            return (
                <div>
                    <span data-testid="logged-in">{isLoggedIn.toString()}</span>
                    <span data-testid="user-id">{userId || 'null'}</span>
                    <span data-testid="error">{error || 'null'}</span>
                </div>
            );
        };
        
        render(
            <UserContextProvider>
                <TestComponent/>
            </UserContextProvider>
        );
        
        expect(screen.getByTestId('logged-in')).toBeInTheDocument();
        expect(screen.getByTestId('user-id')).toBeInTheDocument();
        expect(screen.getByTestId('error')).toBeInTheDocument();
    });
});
