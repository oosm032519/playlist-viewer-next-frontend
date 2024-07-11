// components/ErrorAlert.tsx

import {Alert, AlertDescription, AlertTitle} from "./ui/alert";

/**
 * ErrorAlertProps インターフェース
 * @property {string} error - 表示するエラーメッセージ
 */
interface ErrorAlertProps {
    error: string;
}

/**
 * ErrorAlert コンポーネント
 * @param {ErrorAlertProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} エラーメッセージを表示するアラートコンポーネント
 */
const ErrorAlert: React.FC<ErrorAlertProps> = ({error}: ErrorAlertProps): JSX.Element => (
    <Alert variant="destructive">
        {/* アラートのタイトル */}
        <AlertTitle>Error</AlertTitle>
        {/* アラートの詳細説明としてエラーメッセージを表示 */}
        <AlertDescription>{error}</AlertDescription>
    </Alert>
);

export default ErrorAlert;
