// UserContext.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import {UserContextProvider, useUser} from './UserContext';
import * as checkSessionModule from '../lib/checkSession';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('../lib/checkSession');

// グローバルなfetchのモック
global.fetch = jest.fn() as jest.Mock;

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('UserContextProvider', () => {
    it('初期状態で正しく描画される', async () => {
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
        
        expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
        expect(screen.getByTestId('user-id')).toHaveTextContent('null');
        expect(screen.getByTestId('error')).toHaveTextContent('null');
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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('セッションが有効な場合、正しく状態が更新される', async () => {
        (checkSessionModule.checkSession as jest.Mock).mockResolvedValue(true);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({userId: 'test-user-id'}),
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
        (checkSessionModule.checkSession as jest.Mock).mockResolvedValue(false);
        
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
    it('セッションチェック中にエラーが発生した場合、正しくエラー状態が設定される', async () => {
        (checkSessionModule.checkSession as jest.Mock).mockRejectedValue(new Error('セッションチェックエラー'));
        
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
            expect(screen.getByTestId('error')).toHaveTextContent('ユーザーIDの取得中にエラーが発生しました。');
        });
    });
    
    it('ユーザーID取得中にエラーが発生した場合、正しくエラー状態が設定される', async () => {
        (checkSessionModule.checkSession as jest.Mock).mockResolvedValue(true);
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
            expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            expect(screen.getByTestId('error')).toHaveTextContent('ユーザーIDの取得中にエラーが発生しました。');
        });
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
    
    it('HTTPエラーが発生した場合、正しくエラー状態が設定される', async () => {
        (checkSessionModule.checkSession as jest.Mock).mockResolvedValue(true);
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
            expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
            expect(screen.getByTestId('user-id')).toHaveTextContent('null');
            expect(screen.getByTestId('error')).toHaveTextContent('ユーザーIDの取得中にエラーが発生しました。');
        });
        
        expect(console.error).toHaveBeenCalledWith(
            'ユーザーIDの取得中にエラーが発生しました:',
            'HTTP error! status: 500',
            undefined
        );
    });
    
    it('非Errorオブジェクトのエラーが発生した場合、正しくエラー状態が設定される', async () => {
        (checkSessionModule.checkSession as jest.Mock).mockRejectedValue('非Errorオブジェクトのエラー');
        
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
            expect(screen.getByTestId('error')).toHaveTextContent('ユーザーIDの取得中にエラーが発生しました。');
        });
        
        expect(console.error).toHaveBeenCalledWith(
            'ユーザーIDの取得中にエラーが発生しました:',
            '非Errorオブジェクトのエラー'
        );
    });
});
