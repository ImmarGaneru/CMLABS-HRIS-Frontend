'use client';
import { useEffect, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { IoMdArrowDropdown } from "react-icons/io";
import api from '@/lib/axios';

type Approval = {
    id: number;
    employee_name: string;
    type: string;
    status: string;
    created_at: string;
}

export default function ApprovalSum(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState<Approval[]>([]);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/employees/dashboard/recent-approvals');

                if (Array.isArray(res.data.data?.data)) {
                    setApprovals(res.data.data.data.filter((a: Approval) => a.status.toLowerCase() === 'pending'));
                } else {
                    setApprovals([]);
                }
            } catch (error) {
                console.error('Error fetching approvals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovals();
    }, []);

    const handleViewAll = () => {
        router.push('/manager/approval');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'pending';
            case 'approved':
                return 'approved';
            case 'rejected':
                return 'rejected';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full h-[440px] px-8 py-8 gap-4 rounded-2xl shadow-md'>
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-[16px]'>Statistik Approval</p>
                        <p className='text-[24px] font-bold'>Catatan Approval</p>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-[16px] text-gray-700">Loading approvals...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!approvals || approvals.length === 0) {
        return (
            <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full h-[440px] px-8 py-8 gap-4 rounded-2xl shadow-md'>
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-[16px]'>Statistik Approval</p>
                        <p className='text-[24px] font-bold'>Catatan Approval</p>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-[16px] text-gray-700 text-center py-8">No recent approvals available</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full h-[440px] px-8 py-8 gap-4 rounded-2xl shadow-md'>
            {/* Top bar */}
            <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[16px]'>Statistik Approval</p>
                    <p className='text-[24px] font-bold'>Catatan Approval</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleViewAll}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdOpenInNew size={24} className="text-[#1E3A5F] hover:text-[#2D8EFF] transition-colors"/>
                    </button>
                </div>
            </div>
            {/* Table Container */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-[#D9D9D9] text-center">
                        <th className="px-4 py-3 font-semibold">Karyawan</th>
                        <th className="px-4 py-3 font-semibold">Jenis</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {approvals.map((approval, index) => (
                        <tr key={approval.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">{approval.employee_name}</td>
                            <td className="px-4 py-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex justify-center">{approval.type}</span>
                            </td>
                            <td className="px-4 py-3">
                                    <span className={`px-3 py-1 rounded-full text-sm flex justify-center ${getStatusColor(approval.status)}`}>
                                        {getStatusLabel(approval.status)}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}