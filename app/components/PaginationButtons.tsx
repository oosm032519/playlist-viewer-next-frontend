"use client";

import {Button} from "./ui/button";

interface PaginationButtonsProps {
    currentPage: number;
    isPending: boolean;
    hasNextPage: boolean;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export default ({
                    currentPage,
                    isPending,
                    hasNextPage,
                    onNextPage,
                    onPrevPage,
                }: PaginationButtonsProps) => (
    <div className="flex justify-center space-x-2 mt-4">
        <Button
            onClick={onPrevPage}
            disabled={isPending || currentPage === 1}
        >
            Previous
        </Button>
        <Button
            onClick={onNextPage}
            disabled={isPending || !hasNextPage}
        >
            Next
        </Button>
    </div>
)
