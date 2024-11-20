// app/context/UserContext.test.tsx
import React from 'react';
import {render, screen, act} from '@testing-library/react';
import {UserContextProvider, useUser} from '@/app/context/UserContext';
import {toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('UserContextProvider', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    it('初期状態で未ログイン状態であること', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({status: 'fail'}),
            }) as Promise<Response>
        );
        
        const TestComponent = () => {
            const {isLoggedIn, userId} = useUser();
            return (
                <div>
                    <span data-testid="login-status">{isLoggedIn ? 'Logged In' : 'Not Logged In'}</span>
                    <span data-testid="user-id">{userId || 'No User ID'}</span>
                </div>
            );
        };
        
        await act(async () => {
            render(
                <UserContextProvider>
                    <TestComponent/>
                </UserContextProvider>
            );
        });
        
        expect(screen.getByTestId('login-status')).toHaveTextContent('Not Logged In');
        expect(screen.getByTestId('user-id')).toHaveTextContent('No User ID');
    });
    
    it('セッションチェックが成功した場合、ログイン状態が更新されること', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({status: 'success', userId: 'test-user-id'}),
            }) as Promise<Response>
        );
        
        const TestComponent = () => {
            const {isLoggedIn, userId} = useUser();
            return (
                <div>
                    <span data-testid="login-status">{isLoggedIn ? 'Logged In' : 'Not Logged In'}</span>
                    <span data-testid="user-id">{userId || 'No User ID'}</span>
                </div>
            );
        };
        
        await act(async () => {
            render(
                <UserContextProvider>
                    <TestComponent/>
                </UserContextProvider>
            );
        });
        
        expect(screen.getByTestId('login-status')).toHaveTextContent('Logged In');
        expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-id');
    });
});

describe('useUser', () => {
    it('UserContextProvider外でuseUserを使用するとエラーがスローされること', () => {
        const TestComponent = () => {
            useUser();
            return null;
        };
        
        expect(() => render(<TestComponent/>)).toThrow(
            'useUser must be used within a UserContextProvider'
        );
    });
});
