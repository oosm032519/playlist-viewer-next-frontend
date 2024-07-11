// app/components/PaginationButtons.test.tsx

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PaginationButtons from './PaginationButtons';
import {expect} from '@jest/globals';

// jest-axeの拡張機能を追加して、アクセシビリティの違反を検出する
expect.extend(toHaveNoViolations);

describe('PaginationButtons', () => {
    // デフォルトのプロパティを定義
    const defaultProps = {
        currentPage: 1,
        isPending: false,
        hasNextPage: true,
        onNextPage: jest.fn(),
        onPrevPage: jest.fn(),
    };
    
    // コンポーネントがクラッシュせずにレンダリングされるかをテスト
    it('renders without crashing', () => {
        render(<PaginationButtons {...defaultProps} />);
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    // 最初のページでは「Previous」ボタンが無効化されているかをテスト
    it('disables Previous button on first page', () => {
        render(<PaginationButtons {...defaultProps} currentPage={1}/>);
        expect(screen.getByText('Previous')).toBeDisabled();
    });
    
    // 最初のページ以外では「Previous」ボタンが有効化されているかをテスト
    it('enables Previous button when not on first page', () => {
        render(<PaginationButtons {...defaultProps} currentPage={2}/>);
        expect(screen.getByText('Previous')).not.toBeDisabled();
    });
    
    // 次のページがない場合に「Next」ボタンが無効化されているかをテスト
    it('disables Next button when there is no next page', () => {
        render(<PaginationButtons {...defaultProps} hasNextPage={false}/>);
        expect(screen.getByText('Next')).toBeDisabled();
    });
    
    // 次のページがある場合に「Next」ボタンが有効化されているかをテスト
    it('enables Next button when there is a next page', () => {
        render(<PaginationButtons {...defaultProps} hasNextPage={true}/>);
        expect(screen.getByText('Next')).not.toBeDisabled();
    });
    
    // 「Next」ボタンがクリックされたときにonNextPageが呼び出されるかをテスト
    it('calls onNextPage when Next button is clicked', () => {
        render(<PaginationButtons {...defaultProps} />);
        fireEvent.click(screen.getByText('Next'));
        expect(defaultProps.onNextPage).toHaveBeenCalled();
    });
    
    // 「Previous」ボタンがクリックされたときにonPrevPageが呼び出されるかをテスト
    it('calls onPrevPage when Previous button is clicked', () => {
        render(<PaginationButtons {...defaultProps} currentPage={2}/>);
        fireEvent.click(screen.getByText('Previous'));
        expect(defaultProps.onPrevPage).toHaveBeenCalled();
    });
    
    // コンポーネントにアクセシビリティの違反がないかをテスト
    it('has no accessibility violations', async () => {
        const {container} = render(<PaginationButtons {...defaultProps} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
