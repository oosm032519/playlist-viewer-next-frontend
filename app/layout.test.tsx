// app/layout.test.tsx

import React from 'react';
import {render} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import RootLayout from '@/app/layout';
import {expect} from '@jest/globals';

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
    __esModule: true,
    default: ({children}: { children: React.ReactNode }) => <div className="error-boundary-mock">{children}</div>,
}));

jest.mock('./components/Footer', () => ({
    __esModule: true,
    default: () => <footer>Mock Footer</footer>,
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
        expect(html).toHaveAttribute('lang', 'ja');
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
                'aria-allowed-attr': {enabled: false}, // aria-expanded属性の検証を無効化
            },
        });
        expect(results).toHaveNoViolations();
    });
});
