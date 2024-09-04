// components/ErrorAlert.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import ErrorAlert from './ErrorAlert';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('ErrorAlert', () => {
    it('renders error message correctly', () => {
        render(<ErrorAlert error="Test error message"/>);
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
    
    it('displays error type when provided', () => {
        render(<ErrorAlert error="Test error" type="認証エラー"/>);
        expect(screen.getByText('Error: 認証エラー')).toBeInTheDocument();
    });
    
    it('shows context information when provided', () => {
        render(<ErrorAlert error="Test error" context="プレイリストの取得"/>);
        expect(screen.getByText('プレイリストの取得 でエラーが発生しました。')).toBeInTheDocument();
    });
    
    it('sanitizes error message to prevent XSS', () => {
        const xssAttempt = '<script>alert("XSS")</script>Malicious content';
        render(<ErrorAlert error={xssAttempt}/>);
        const alertContent = screen.getByRole('alert').textContent;
        expect(alertContent).not.toContain('<script>');
        expect(alertContent).toContain('Malicious content');
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(<ErrorAlert error="Test error" type="テストエラー" context="テスト実行中"/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
