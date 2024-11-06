import React from 'react';
import {render} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import RootLayout from './layout';
import {expect} from '@jest/globals';
import {ThemeProvider} from 'next-themes';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// window.matchMedia をモック
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

jest.mock('./context/UserContext', () => ({
    UserContextProvider: ({children}: { children: React.ReactNode }) => <>{children}</>,
    useUser: () => ({isLoggedIn: false, userId: null, error: null, setIsLoggedIn: jest.fn(), setUserId: jest.fn()}),
}));

jest.mock('./components/ErrorBoundary', () => ({
    __esModule: true, // これがないとエラーになる
    default: ({children}: { children: React.ReactNode }) => <div className="error-boundary-mock">{children}</div>,
}));


describe('RootLayout', () => {
    it('renders children correctly', () => {
        const {getByText} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        expect(getByText('Test Child')).toBeInTheDocument();
    });
    
    it('applies correct CSS classes', () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const body = container.querySelector('body');
        expect(body).not.toBeNull();
        if (body) {
            expect(body.className).toContain('className');
        }
    });
    
    it('sets correct lang attribute', () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const html = container.querySelector('html');
        expect(html).not.toBeNull();
        expect(html).toHaveAttribute('lang', 'ja'); // 'ja' を期待値に設定
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const results = await axe(container, {
            rules: {
                'document-title': {enabled: false},
            },
        });
        expect(results).toHaveNoViolations();
    });
});
