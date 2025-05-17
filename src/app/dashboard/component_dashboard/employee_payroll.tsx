'use client';
import { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function EmployeePayrollSummary() {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

    const handleMonthChange = (date: Date | null) => {
      if (date) {
        setSelectedMonth(date);
        // Here you can add logic to fetch new data based on the selected month
        console.log('Selected month:', date);
      }
    };

    return(
        <div className="bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md">
            {/* Top bar */}
            <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[16px]'>Statistik Gaji</p>
                    <p className='text-[24px] font-bold'>Rangkuman Data Gaji</p>
                </div>
                <div className="relative">
                    <DatePicker
                        selected={selectedMonth}
                        onChange={handleMonthChange}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        className="flex flex-row items-center justify-between h-[56px] gap-2 border border-[#141414]/30 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer w-[200px]"
                        wrapperClassName="w-fit"
                        popperClassName="z-50"
                        popperPlacement="bottom-end"
                        customInput={
                        <div>
                            <span className='text-gray-700 text-[16px]'>
                            {selectedMonth.toLocaleDateString('id-ID', { 
                                month: 'long',
                                year: 'numeric'
                            })}
                            </span>
                            <IoMdArrowDropdown size={24} className="text-gray-500" />
                        </div>
                        }
                    />
                </div>
            </div>
            {/* Isi */}
            <div className='flex flex-row w-full h-full justify-center'>
                {/* Card Gaji */}
                <div className='flex flex-col gap-4 w-full h-full text-xl font-bold text-[#141414] border border-[#141414]/30 text-center justify-center'>
                    <p>Total Gaji Bulan Ini</p>
                    <p>Rp 12.480.000</p>
                    <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                        <p>0 %</p>
                        <p>dari bulan sebelumnya</p>
                    </div>
                </div>
                {/* Card Rata-rata Gaji */}
                <div className='flex flex-col gap-4 w-full h-full text-xl font-bold text-[#141414] border border-[#141414]/30 text-center justify-center'>
                    <p>Rerata Gaji Bulan Ini</p>
                    <p>Rp 4.620.000</p>
                    <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                        <p>0 %</p>
                        <p>dari bulan sebelumnya</p>
                    </div>
                </div>
            </div>
        </div>
    );
}