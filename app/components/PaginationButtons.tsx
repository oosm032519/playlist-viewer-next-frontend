// app/components/PaginationButtons.tsx

"use client";

import {Button} from "./ui/button";

// PaginationButtonsコンポーネントのプロパティの型定義
interface PaginationButtonsProps {
    currentPage: number; // 現在のページ番号
    isPending: boolean; // ページ遷移が保留中かどうか
    hasNextPage: boolean; // 次のページが存在するかどうか
    onNextPage: () => void; // 次のページに進むためのコールバック関数
    onPrevPage: () => void; // 前のページに戻るためのコールバック関数
}

/**
 * PaginationButtonsコンポーネント
 * ページネーションの「前へ」「次へ」ボタンを表示する
 *
 * @param {PaginationButtonsProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ページネーションボタンのJSX要素
 *
 * @example
 * <PaginationButtons
 *   currentPage={1}
 *   isPending={false}
 *   hasNextPage={true}
 *   onNextPage={() => console.log('Next page')}
 *   onPrevPage={() => console.log('Previous page')}
 * />
 */
const PaginationButtons = ({
                               currentPage,
                               isPending,
                               hasNextPage,
                               onNextPage,
                               onPrevPage,
                           }: PaginationButtonsProps): JSX.Element => (
    <div className="flex justify-center space-x-2 mt-4">
        {/* 前のページに戻るボタン */}
        <Button
            onClick={onPrevPage}
            disabled={isPending || currentPage === 1} // ページ遷移中または現在のページが1の場合は無効化
        >
            Previous
        </Button>
        {/* 次のページに進むボタン */}
        <Button
            onClick={onNextPage}
            disabled={isPending || !hasNextPage} // ページ遷移中または次のページが存在しない場合は無効化
        >
            Next
        </Button>
    </div>
);

export default PaginationButtons;
