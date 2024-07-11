// app/layout.test.tsx

import React from 'react';
import {render} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import RootLayout from './layout';
import {expect} from '@jest/globals';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

describe('RootLayout', () => {
    /**
     * 子要素が正しくレンダリングされるかをテスト
     */
    it('renders children correctly', () => {
        const {getByText} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        // 子要素がドキュメント内に存在することを確認
        expect(getByText('Test Child')).toBeInTheDocument();
    });
    
    /**
     * 正しいCSSクラスが適用されているかをテスト
     */
    it('applies correct CSS classes', () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const body = container.querySelector('body');
        // body要素が存在することを確認
        expect(body).not.toBeNull();
        if (body) { // TypeScriptの型ガードを使用
            // bg-gray-darkクラスが存在することを確認
            expect(body).toHaveClass('bg-gray-dark');
            // text-gray-100クラスが存在することを確認
            expect(body).toHaveClass('text-gray-100');
            
            // Interフォントのクラスが存在することを確認
            const classNames = body.className.split(' ');
            // bg-gray-dark, text-gray-100に加えて少なくとも1つのクラスがあることを確認
            expect(classNames.length).toBeGreaterThan(2);
            
            // Interフォントのクラスが動的に生成されているため、具体的な名前ではなく存在を確認
            const hasInterClass = classNames.some(className => className !== 'bg-gray-dark' && className !== 'text-gray-100');
            expect(hasInterClass).toBe(true);
        }
    });
    
    /**
     * 正しいlang属性が設定されているかをテスト
     */
    it('sets correct lang attribute', () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        const html = container.querySelector('html');
        // html要素が存在することを確認
        expect(html).not.toBeNull();
        // lang属性が'en'であることを確認
        expect(html).toHaveAttribute('lang', 'en');
    });
    
    /**
     * アクセシビリティ違反がないかをテスト
     */
    it('has no accessibility violations', async () => {
        const {container} = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>
        );
        // axeによるアクセシビリティテストを実行
        const results = await axe(container, {
            rules: {
                'document-title': {enabled: false} // document-titleルールを無効化
            }
        });
        // アクセシビリティ違反がないことを確認
        expect(results).toHaveNoViolations();
    });
});
