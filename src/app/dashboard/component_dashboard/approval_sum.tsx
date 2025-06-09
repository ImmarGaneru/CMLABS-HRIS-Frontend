'use client';
import { MdOpenInNew } from "react-icons/md";
import { FaEye } from "react-icons/fa";

export default function ApprovalSum(){
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
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">1</td>
                            <td className="px-4 py-3">Aleron Tsaqif Rakha</td>
                            <td className="px-4 py-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Izin</span>
                            </td>
                            <td className="px-4 py-3">
                                <button className="p-2 text-[#2D8EFF] bg-[#2D8EFF]/30 rounded-lg hover:bg-[#2D8EFF]/40 transition-colors">
                                    <FaEye size={20} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}