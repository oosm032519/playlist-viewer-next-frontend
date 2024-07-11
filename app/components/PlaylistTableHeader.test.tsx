// app/components/PlaylistTableHeader.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistTableHeader from './PlaylistTableHeader';
import {expect} from '@jest/globals';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

describe('PlaylistTableHeader', () => {
    /**
     * テーブルヘッダーが正しいカラムでレンダリングされることをテスト
     */
    it('renders the table header with correct columns', () => {
        render(
            <table>
                <PlaylistTableHeader/>
            </table>
        );
        
        // テーブルヘッダーが正しくレンダリングされているかを確認
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Tracks')).toBeInTheDocument();
    });
    
    /**
     * アクセシビリティ違反がないことをテスト
     */
    it('has no accessibility violations', async () => {
        const {container} = render(
            <table>
                <PlaylistTableHeader/>
            </table>
        );
        // axeによるアクセシビリティテストを実行
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
