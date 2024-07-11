// app/components/LoadingSpinner.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoadingSpinner from './LoadingSpinner';
import {expect} from '@jest/globals';

// jest-axeの拡張機能を追加
expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
    /**
     * ローディングがtrueのときにスピナーが表示されることを確認するテスト
     */
    it('renders the spinner when loading is true', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // スピナーが存在し、表示されていることを確認
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle('display: flex');
    });
    
    /**
     * ローディングがfalseのときにスピナーが表示されないことを確認するテスト
     */
    it('does not render the spinner when loading is false', () => {
        render(<LoadingSpinner loading={false}/>);
        
        // スピナーが存在するが、非表示であることを確認
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle('display: none');
    });
    
    /**
     * ローディング中に正しいaria属性が設定されていることを確認するテスト
     */
    it('has correct aria attributes when loading', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // スピナーに正しいaria属性が設定されていることを確認
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '100');
        expect(spinner).toHaveAttribute('aria-valuemin', '0');
        expect(spinner).toHaveAttribute('aria-valuemax', '100');
        expect(spinner).toHaveAttribute('aria-label', 'Loading progress');
    });
    
    /**
     * ローディングしていないときに正しいaria属性が設定されていることを確認するテスト
     */
    it('has correct aria attributes when not loading', () => {
        render(<LoadingSpinner loading={false}/>);
        
        // スピナーに正しいaria属性が設定されていることを確認
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '0');
        expect(spinner).toHaveAttribute('aria-valuemin', '0');
        expect(spinner).toHaveAttribute('aria-valuemax', '100');
        expect(spinner).toHaveAttribute('aria-label', 'Loading progress');
    });
    
    /**
     * スピナーコンテナに正しいスタイルが適用されていることを確認するテスト
     */
    it('applies correct styles to the spinner container', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // スピナーコンテナに正しいクラスが適用されていることを確認
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveClass('fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50');
    });
    
    /**
     * ローディングがtrueのときにClipLoaderが表示されることを確認するテスト
     */
    it('renders ClipLoader when loading is true', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // ClipLoaderが存在し、aria-hidden属性が設定されていることを確認
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toBeInTheDocument();
        expect(clipLoader).toHaveAttribute('aria-hidden', 'true');
    });
    
    /**
     * ローディングがfalseのときにClipLoaderが表示されないことを確認するテスト
     */
    it('does not render ClipLoader when loading is false', () => {
        render(<LoadingSpinner loading={false}/>);
        
        // ClipLoaderが存在しないことを確認
        const progressbar = screen.getByRole('progressbar', {hidden: true});
        const clipLoader = progressbar.querySelector('span');
        expect(clipLoader).not.toBeInTheDocument();
    });
    
    /**
     * アクセシビリティ違反がないことを確認するテスト
     */
    it('should not have any accessibility violations', async () => {
        const {container} = render(<LoadingSpinner loading={true}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    /**
     * ローディングプロップが変更されたときにaria-valuenowが更新されることを確認するテスト
     */
    it('should update aria-valuenow when loading prop changes', () => {
        const {rerender} = render(<LoadingSpinner loading={false}/>);
        
        // 初期状態でaria-valuenowが0であることを確認
        let spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '0');
        
        // ローディングプロップをtrueに変更後、aria-valuenowが100であることを確認
        rerender(<LoadingSpinner loading={true}/>);
        spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '100');
    });
    
    /**
     * ClipLoaderの色が正しいことを確認するテスト
     */
    it('should have correct color for ClipLoader', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // ClipLoaderの色が正しいことを確認
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toHaveStyle('border-top-color: #1DB954');
    });
    
    /**
     * ClipLoaderのサイズが正しいことを確認するテスト
     */
    it('should have correct size for ClipLoader', () => {
        render(<LoadingSpinner loading={true}/>);
        
        // ClipLoaderのサイズが正しいことを確認
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toHaveStyle('width: 100px; height: 100px');
    });
});
