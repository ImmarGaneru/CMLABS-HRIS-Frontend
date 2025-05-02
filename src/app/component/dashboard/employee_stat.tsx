'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IoMdArrowDropdown } from "react-icons/io";

const data = [
  { label: 'On Time', total: 83 },
  { label: 'Terlambat', total: 10 },
  { label: 'Absen', total: 7 },
];

export default function EmployeeStat() {
  return (
    <div className='flex flex-wrap justify-center items-start gap-4'>
        {/* Bar chart - Rangkuman Karyawan */}
        <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-auto min-w-[480px] h-fit min-h-[400px] px-8 py-8 gap-2 rounded-2xl'>
            {/* Top bar */}
            <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[16px]'>Statistik Karyawan</p>
                    <p className='text-[24px] font-bold'>Rangkuman Data Jumlah Karyawan</p>
                </div>
                <button className='flex flex-row items-center justify-stretch h-[56px] gap-2 border border-[#141414]/30 rounded-lg px-2 py-2 hover:bg-gray-200 transition-colors'>
                    <span className='text-gray-700 text-[16px]'>Pilih Bulan</span>
                    <IoMdArrowDropdown size={24} className="text-gray-500" />
                </button>
            </div>
            {/* Isi */}
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#1E3A5F" />
            </BarChart>
            </ResponsiveContainer>
        </div>
        
    </div>
  );
}