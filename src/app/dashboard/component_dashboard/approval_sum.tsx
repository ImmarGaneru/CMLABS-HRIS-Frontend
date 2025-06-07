'use client';
import { useEffect, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";
import { FaEye } from "react-icons/fa";

interface Approval {
    id: number;
    employee_name: string;
    type: string;
}

export default function ApprovalSum(){
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState<Approval[]>([]);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API call
                // const response = await fetch('/api/approvals/recent');
                // const data = await response.json();
                // setApprovals(data);
                
                // Temporary mock data
                setApprovals([
                    {
                        id: 1,
                        employee_name: "Aleron Tsaqif Rakha",
                        type: "Izin"
                    }
                ]);
            } catch (error) {
                console.error('Error fetching approvals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovals();
    }, []);

    if (loading) {
        return (
            <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full h-[440px] px-8 py-8 gap-4 rounded-2xl shadow-md'>
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4 pb-4'>
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
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4 pb-4'>
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
            <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4 pb-4'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[16px]'>Statistik Approval</p>
                    <p className='text-[24px] font-bold'>Catatan Approval</p>
                </div>
                <div className="relative">
                    <MdOpenInNew size={24} className="text-[#1E3A5F] hover:text-[#2D8EFF] transition-colors cursor-pointer"/>
                </div>
            </div>
            {/* Table Container */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#D9D9D9]">
                            <th className="px-4 py-3 text-left font-semibold">No</th>
                            <th className="px-4 py-3 text-left font-semibold">Nama Karyawan</th>
                            <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                            <th className="px-4 py-3 text-left font-semibold">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvals.map((approval, index) => (
                            <tr key={approval.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{approval.employee_name}</td>
                                <td className="px-4 py-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{approval.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="p-2 text-[#2D8EFF] bg-[#2D8EFF]/30 rounded-lg hover:bg-[#2D8EFF]/40 transition-colors">
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