import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage?: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function DataTablePagination({
    currentPage,
    lastPage,
    total,
    perPage = 20,
    onPageChange,
    className = '',
}: PaginationProps) {
    if (total === 0 || lastPage <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, total);

    // Calculate visible page range (up to 5 pages)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (lastPage <= maxVisible) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(lastPage, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < lastPage) {
                if (end < lastPage - 1) pages.push('...');
                pages.push(lastPage);
            }
        }

        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] text-xs text-[#5f6368] dark:text-[#9aa0a6] ${className}`}>
            <div className="font-mono text-[11px]">
                Showing <span className="font-semibold text-[#202124] dark:text-[#ffffff]">{startItem}</span> to{' '}
                <span className="font-semibold text-[#202124] dark:text-[#ffffff]">{endItem}</span> of{' '}
                <span className="font-semibold text-[#202124] dark:text-[#ffffff]">{total}</span> records
            </div>

            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                    className="h-8 w-8 text-xs border-[#dadce0] dark:border-[#3c4043]"
                    title="First page"
                >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 w-8 text-xs border-[#dadce0] dark:border-[#3c4043]"
                    title="Previous page"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </Button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (page === '...') {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-1.5 text-xs select-none">
                                    …
                                </span>
                            );
                        }

                        const pageNum = Number(page);
                        const isActive = pageNum === currentPage;

                        return (
                            <Button
                                key={pageNum}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(pageNum)}
                                className={`h-8 min-w-[2rem] px-2 text-xs font-mono transition-colors ${
                                    isActive
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 font-semibold border-emerald-600'
                                        : 'border-[#dadce0] dark:border-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#ffffff]'
                                }`}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="h-8 w-8 text-xs border-[#dadce0] dark:border-[#3c4043]"
                    title="Next page"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(lastPage)}
                    disabled={currentPage >= lastPage}
                    className="h-8 w-8 text-xs border-[#dadce0] dark:border-[#3c4043]"
                    title="Last page"
                >
                    <ChevronsRight className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}
