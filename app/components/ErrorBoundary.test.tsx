// app/components/ErrorBoundary.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// エラーを発生させるためのコンポーネント
const ErrorComponent = () => {
    throw new Error('Test error');
};

// コンソールエラーを抑制（エラーバウンダリのテストで必要）
const originalError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});
afterAll(() => {
    console.error = originalError;
});

// NODE_ENVをモック化する関数
const mockNodeEnv = (envValue: 'development' | 'production' | 'test') => {
    const originalEnv = process.env.NODE_ENV;
    const env = {...process.env};
    Object.defineProperty(env, 'NODE_ENV', {
        value: envValue,
        configurable: true,
    });
    jest.replaceProperty(process, 'env', env);
    return () => {
        jest.replaceProperty(process, 'env', {...process.env, NODE_ENV: originalEnv});
    };
};

describe('ErrorBoundary', () => {
    it('正常に子コンポーネントをレンダリングする', () => {
        render(
            <ErrorBoundary>
                <div>Test Child</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
    
    it('エラーが発生した場合、エラーメッセージを表示する', () => {
        render(
            <ErrorBoundary>
                <ErrorComponent/>
            </ErrorBoundary>
        );
        expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
        expect(screen.getByText('予期せぬエラーが発生しました。しばらくしてからもう一度お試しください。')).toBeInTheDocument();
    });
    
    it('開発モードでエラーの詳細を表示する', () => {
        const restoreEnv = mockNodeEnv('development');
        
        render(
            <ErrorBoundary>
                <ErrorComponent/>
            </ErrorBoundary>
        );
        
        expect(screen.getByText('エラーの詳細')).toBeInTheDocument();
        
        restoreEnv();
    });
    
    it('本番モードではエラーの詳細を表示しない', () => {
        const restoreEnv = mockNodeEnv('production');
        
        render(
            <ErrorBoundary>
                <ErrorComponent/>
            </ErrorBoundary>
        );
        
        expect(screen.queryByText('エラーの詳細')).not.toBeInTheDocument();
        
        restoreEnv();
    });
    
    it('アクセシビリティ要件を満たしている', async () => {
        const {container} = render(
            <ErrorBoundary>
                <ErrorComponent/>
            </ErrorBoundary>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
