// components/ErrorAlert.tsx

import {Alert, AlertDescription, AlertTitle} from "@/app/components/ui/alert";
import DOMPurify from 'dompurify';

/**
 * `ErrorAlert`コンポーネントのpropsを定義
 * @property {string} error - 表示するエラーメッセージ
 * @property {string} type - エラーの種類 (例: "認証エラー", "ネットワークエラー")
 * @property {string} context - エラーが発生したコンテキスト情報 (例: "プレイリストの取得")
 */
interface ErrorAlertProps {
    error: string;
    type?: string;
    context?: string;
}

/**
 * エラーメッセージを表示するためのアラートを提供する
 *
 * @param {ErrorAlertProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} エラーメッセージを含むアラートコンポーネント
 */
const ErrorAlert: React.FC<ErrorAlertProps> = ({error, type, context}: ErrorAlertProps): JSX.Element => {
    // サニタイズされたエラーメッセージを作成
    const sanitizedError = DOMPurify.sanitize(error, {ALLOWED_TAGS: []});
    
    return (
        <Alert variant="destructive">
            <AlertTitle>Error: {type}</AlertTitle>
            <AlertDescription>
                {context && <p>{context} でエラーが発生しました。</p>}
                <p>{sanitizedError}</p>
            </AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
