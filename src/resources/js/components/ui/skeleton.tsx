import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                "animate-pulse rounded-md bg-[#dadce0]/70 dark:bg-[#3c4043]/60",
                className
            )}
            {...props}
        />
    )
}

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    hasKebabAction?: boolean;
    className?: string;
}

/**
 * Dynamic Table Skeleton Loader
 * Renders an authentic table structure with a header and customizable rows/columns matching the exact geometry of our system tables.
 */
function TableSkeleton({
    rows = 5,
    columns = 4,
    hasKebabAction = true,
    className = "",
}: TableSkeletonProps) {
    return (
        <div className={cn("border border-[#dadce0] dark:border-[#3c4043] rounded-xl overflow-hidden bg-white dark:bg-[#303134] shadow-xs", className)}>
            <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left">
                    <thead className="bg-[#f8f9fa] dark:bg-[#202124] border-b border-[#dadce0] dark:border-[#3c4043]">
                        <tr>
                            {hasKebabAction && (
                                <th className="px-4 py-3.5 w-16 text-center">
                                    <Skeleton className="h-4 w-6 mx-auto rounded" />
                                </th>
                            )}
                            {Array.from({ length: columns - (hasKebabAction ? 1 : 0) }).map((_, idx) => (
                                <th key={`th-${idx}`} className="px-5 py-3.5">
                                    <Skeleton className={cn("h-3.5 rounded", idx === 0 ? "w-28" : idx === 1 ? "w-24" : "w-20")} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dadce0] dark:divide-[#3c4043]">
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr key={`tr-${rowIdx}`} className="bg-white dark:bg-[#303134]">
                                {hasKebabAction && (
                                    <td className="px-4 py-4 text-center">
                                        <Skeleton className="h-7 w-7 rounded-lg mx-auto" />
                                    </td>
                                )}
                                {Array.from({ length: columns - (hasKebabAction ? 1 : 0) }).map((_, colIdx) => (
                                    <td key={`td-${rowIdx}-${colIdx}`} className="px-5 py-4">
                                        {colIdx === 0 ? (
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                                <div className="space-y-1.5 flex-1">
                                                    <Skeleton className="h-3.5 w-32 rounded" />
                                                    <Skeleton className="h-3 w-44 rounded" />
                                                </div>
                                            </div>
                                        ) : colIdx === 1 ? (
                                            <div className="flex gap-1.5">
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                                <Skeleton className="h-5 w-20 rounded-full" />
                                            </div>
                                        ) : (
                                            <Skeleton className="h-3.5 w-24 rounded" />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination bar placeholder */}
            <div className="px-4 py-3 border-t border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] flex items-center justify-between">
                <Skeleton className="h-3.5 w-40 rounded" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

interface CardGridSkeletonProps {
    count?: number;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

/**
 * Dynamic Card Grid Skeleton Loader
 * Useful for Location cards, Roles grid, and dashboard widgets.
 */
function CardGridSkeleton({
    count = 6,
    columns = 3,
    className = "",
}: CardGridSkeletonProps) {
    const gridCols =
        columns === 1
            ? "grid-cols-1"
            : columns === 2
            ? "grid-cols-1 md:grid-cols-2"
            : columns === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

    return (
        <div className={cn("grid gap-6", gridCols, className)}>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={`card-skeleton-${idx}`}
                    className="border border-[#dadce0] dark:border-[#3c4043] rounded-xl bg-white dark:bg-[#303134] p-5 space-y-4 shadow-xs"
                >
                    <div className="flex items-center justify-between pb-3 border-b border-[#dadce0]/60 dark:border-[#3c4043]/60">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-28 rounded" />
                                <Skeleton className="h-3 w-16 rounded" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="h-3.5 w-full rounded" />
                        <Skeleton className="h-3.5 w-3/4 rounded" />
                    </div>
                    <div className="pt-3 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60 flex justify-end gap-2">
                        <Skeleton className="h-7 w-14 rounded-lg" />
                        <Skeleton className="h-7 w-14 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    )
}

interface FormSkeletonProps {
    fields?: number;
    className?: string;
}

/**
 * Dynamic Form Skeleton Loader
 * Matches modals, settings panels, and detail sheets.
 */
function FormSkeleton({
    fields = 4,
    className = "",
}: FormSkeletonProps) {
    return (
        <div className={cn("space-y-4 p-4 border border-[#dadce0] dark:border-[#3c4043] rounded-xl bg-white dark:bg-[#303134]", className)}>
            {Array.from({ length: fields }).map((_, idx) => (
                <div key={`field-${idx}`} className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>
            ))}
            <div className="pt-3 flex justify-end gap-2">
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
        </div>
    )
}

export { Skeleton, TableSkeleton, CardGridSkeleton, FormSkeleton }
