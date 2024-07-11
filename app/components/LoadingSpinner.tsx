// app/components/LoadingSpinner.tsx
"use client";

import {ClipLoader} from "react-spinners";

interface LoadingSpinnerProps {
    loading: boolean;
}

/**
 * ローディングスピナーコンポーネント
 * @param {LoadingSpinnerProps} props - ローディング状態を示すプロパティ
 * @returns {JSX.Element} ローディングスピナーのJSX要素
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({loading}) => {
    return (
        <div
            // ローディング中に画面全体を覆うオーバーレイ
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50 loading-spinner"
            // ローディング状態に応じて表示を切り替える
            style={{display: loading ? "flex" : "none"}}
            // アクセシビリティのための属性
            role="progressbar"
            aria-valuenow={loading ? 100 : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
        >
            <ClipLoader
                // スピナーの色を設定
                color="#1DB954"
                // ローディング状態をスピナーに渡す
                loading={loading}
                // スピナーのサイズを設定
                size={100}
                // アクセシビリティのための属性
                aria-hidden="true"
            />
        </div>
    );
};

export default LoadingSpinner;
