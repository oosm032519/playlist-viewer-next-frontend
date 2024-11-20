// app/components/ErrorBoundary.tsx

import React, {Component, ErrorInfo} from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/app/components/ui/alert";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * エラー境界コンポーネント
 * 子コンポーネントで発生したエラーをキャッチし、エラーメッセージを表示する。
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false, error: null, errorInfo: null};
    }
    
    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error};
    }
    
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({error, errorInfo});
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="destructive">
                    <AlertTitle>エラーが発生しました</AlertTitle>
                    <AlertDescription>
                        <p>予期せぬエラーが発生しました。しばらくしてからもう一度お試しください。</p>
                        {/* 開発モードの場合、エラーの詳細を表示 */}
                        {process.env.NODE_ENV === 'development' && (
                            <details>
                                <summary>エラーの詳細</summary>
                                <pre>{this.state.error?.stack}</pre>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </details>
                        )}
                    </AlertDescription>
                </Alert>
            );
        }
        
        return this.props.children;
    }
}

export default ErrorBoundary;
