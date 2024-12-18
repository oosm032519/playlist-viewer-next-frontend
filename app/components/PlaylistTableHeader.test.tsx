// app/components/PlaylistTableHeader.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistTableHeader from '@/app/components/PlaylistTableHeader';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('PlaylistTableHeader', () => {
    /**
     * テーブルヘッダーが正しいカラムでレンダリングされることをテスト
     */
    it('renders the table header with correct columns', () => {
        render(
            <table>
                <PlaylistTableHeader totalPlaylists={10}/>
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
                <PlaylistTableHeader totalPlaylists={10}/>
            </table>
        );
        // axeによるアクセシビリティテストを実行
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
