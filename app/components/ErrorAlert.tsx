import {Alert, AlertDescription, AlertTitle} from "./ui/alert";

interface ErrorAlertProps {
    error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({error}) => (
    <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
    </Alert>
);

export default ErrorAlert;
