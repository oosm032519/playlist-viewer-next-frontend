// components/ErrorAlert.tsx

import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import DOMPurify from 'dompurify';

interface ErrorAlertProps {
    error: string;
}

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
