/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { LoadingSpinner } from "./ui/LoadingSpinner";

export default function OverlaySpinner({
    isLoading = true,
    className = "",
}: {
    isLoading?: boolean;
    className?: string;
}) {
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-900 opacity-50 z-5 ${className}`}
            style={{ display: isLoading ? 'flex' : 'none' }}
        >
            <LoadingSpinner className="w-16 h-16 text-white animate-spin" />
        </div>
    );
}