'use client';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <FaLock className="text-[#1E3A5F] text-6xl" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E3A5F] mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>
                <button
                    onClick={() => router.push('/employee/dashboard')}
                    className="bg-[#1E3A5F] text-white px-6 py-2 rounded-lg hover:bg-[#2c5282] transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
} 