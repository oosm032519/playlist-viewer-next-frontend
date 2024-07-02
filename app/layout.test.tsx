// RootLayout.test.tsx

import React from 'react';
import {render} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import RootLayout from './layout';

expect.extend(toHaveNoViolations);

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
        expect(body).not.toBeNull(); // body要素が存在することを確認
        if (body) { // TypeScriptの型ガードを使用
            expect(body).toHaveClass('bg-gray-dark');
            expect(body).toHaveClass('text-gray-100');
            
            // Inter fontのクラスが存在することを確認
            const classNames = body.className.split(' ');
            expect(classNames.length).toBeGreaterThan(2); // bg-gray-dark, text-gray-100 に加えて少なくとも1つのクラスがある
            
            // Inter fontのクラスが動的に生成されているため、具体的な名前ではなく存在を確認
            const hasInterClass = classNames.some(className => className !== 'bg-gray-dark' && className !== 'text-gray-100');
            expect(hasInterClass).toBe(true);
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
        expect(html).toHaveAttribute('lang', 'en');
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const results = await axe(container, {
            rules: {
                'document-title': {enabled: false}
            }
        });
        expect(results).toHaveNoViolations();
    });
});

// Metadata のテスト
import {metadata} from './layout';

describe('Metadata', () => {
    it('has correct title', () => {
        expect(metadata.title).toBe('Playlist Viewer Next');
    });
    
    it('has correct description', () => {
        expect(metadata.description).toBe('View and analyze Spotify playlists');
    });
});
