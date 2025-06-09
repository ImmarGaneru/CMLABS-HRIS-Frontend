'use client';

import { MdOutlineGroup } from 'react-icons/md';

export default function EmployeeSumCard() {
    return(
        <div className='flex flex-row gap-6 w-full h-fit'>
            {/* Card Total Karyawan */}
            <div className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Total Karyawan</p>
                </div>
                <p className='text-[24px] font-bold'>280</p>
                <p className='text-[14px]'>Update: tanggal</p>
            </div>
            {/* Card Karyawan Aktif */}
            <div className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Aktif</p>
                </div>
                <p className='text-[24px] font-bold'>280</p>
                <p className='text-[14px]'>Update: tanggal</p>
            </div>
            
            {/* Card Karyawan Baru */}
            <div className='bg-gray-50 text-[#257047] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Baru</p>
                </div>
                <p className='text-[24px] font-bold'>280</p>
                <p className='text-[14px]'>Update: tanggal</p>
            </div>

            {/* Card Karyawan Resign */}
            <div className='bg-gray-50 text-[#BA3C54] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Resign</p>
                </div>
                <p className='text-[24px] font-bold'>280</p>
                <p className='text-[14px]'>Update: tanggal</p>
            </div>

        </div>
    );
}