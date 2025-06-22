'use client';
import { Suspense } from 'react';
import Invoice from '@/app/manager/subscription/component_payment/invoice';
import { useParams } from 'next/navigation';

export default function InvoicePage() {
    const params = useParams();
    // params.id is string | string[] | undefined
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    return (
        <Suspense fallback="Loading...">
            <div className="px-2 py-4">
                <Invoice id={id} />
            </div>
        </Suspense>
    );
} 