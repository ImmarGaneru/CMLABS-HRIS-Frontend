'use client';
import { useEffect, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { IoMdArrowDropdown } from "react-icons/io";

interface Approval {
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
    const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");
    const [filter, setFilter] = useState('pending');
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/admin/employees/dashboard/recent-approvals', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (filter !== 'all') {
                    setApprovals(result.data.filter((a: Approval) => a.status.toLowerCase() === filter));
                } else {
                    setApprovals(result.data);
                }
            } catch (error) {
                console.error('Error fetching approvals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovals();
    }, [token, filter]);

    const handleViewAll = () => {
        router.push('/approval');
    };

    const handleViewDetail = (id: number) => {
        router.push(`/approval/${id}`);
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
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#1E3A5F] rounded-lg text-[#1E3A5F] hover:bg-[#1E3A5F]/10 transition-colors"
                        >
                            <span>Filter: {getStatusLabel(filter)}</span>
                            <IoMdArrowDropdown size={20} />
                        </button>
                        {showFilter && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setFilter('all');
                                            setShowFilter(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter('pending');
                                            setShowFilter(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter('approved');
                                            setShowFilter(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        Approved
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter('rejected');
                                            setShowFilter(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        Rejected
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                            <th className="px-4 py-3 font-semibold">Detail</th>
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
                                <td className="px-4 py-3 flex justify-center">
                                    <button 
                                        onClick={() => handleViewDetail(approval.id)}
                                        className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                                    >
                                        <FaEye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}