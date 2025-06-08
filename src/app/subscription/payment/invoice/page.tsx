'use client';
import { Suspense } from 'react';
import Invoice from '@/app/subscription/payment/component_payment/invoice';

export default function InvoicePage() {
    return (
        <Suspense fallback="Loading...">
            <div className="px-2 py-4">
                <Invoice />
            </div>
        </Suspense>
    );
} 