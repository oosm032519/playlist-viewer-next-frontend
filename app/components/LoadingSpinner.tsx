// app/components/LoadingSpinner.tsx
"use client";

import {ClipLoader} from "react-spinners";

interface LoadingSpinnerProps {
    loading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({loading}) => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50"
             style={{display: loading ? 'flex' : 'none'}}>
            <ClipLoader
                color="#1DB954"
                loading={loading}
                size={100}
                aria-label="Loading Spinner"
            />
        </div>
    );
};

export default LoadingSpinner;
