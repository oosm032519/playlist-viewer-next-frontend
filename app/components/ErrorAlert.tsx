// components/ErrorAlert.tsx

import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import DOMPurify from 'dompurify';

/**
 * `ErrorAlertProps`は`ErrorAlert`コンポーネントのpropsを定義します。
 * @property {string} error - 表示するエラーメッセージ
 */
interface ErrorAlertProps {
    error: string;
}

/**
 * `ErrorAlert`コンポーネントは、エラーメッセージを表示するためのアラートを提供します。
 * エラーメッセージはXSS攻撃を防ぐためにサニタイズされます。
 *
 * @param {ErrorAlertProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} エラーメッセージを含むアラートコンポーネント
 *
 * @example
 * <ErrorAlert error="An unexpected error occurred." />
 */
const ErrorAlert: React.FC<ErrorAlertProps> = ({error}: ErrorAlertProps): JSX.Element => {
    // サニタイズされたエラーメッセージを作成
    const sanitizedError = DOMPurify.sanitize(error, {ALLOWED_TAGS: []});
    
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{sanitizedError}</AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
