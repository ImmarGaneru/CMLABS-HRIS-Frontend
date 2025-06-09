'use client';
import { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface PayrollData {
    total_salary: number;
    average_salary: number;
    percentage_change: number;
}

export default function EmployeePayrollSummary() {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<PayrollData | null>(null);

    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API call
                // const response = await fetch('/api/payroll/summary');
                // const result = await response.json();
                // setData(result);
                
                // Temporary mock data
                setData({
                    total_salary: 12480000,
                    average_salary: 4620000,
                    percentage_change: 0
                });
            } catch (error) {
                console.error('Error fetching payroll data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, [selectedMonth]);

    const handleMonthChange = (date: Date | null) => {
        if (date) {
            setSelectedMonth(date);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md">
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-[16px]'>Statistik Gaji</p>
                        <p className='text-[24px] font-bold'>Rangkuman Data Gaji</p>
                    </div>
                </div>
                <div className='flex flex-row w-full h-full justify-center'>
                    {[1, 2].map((_, index) => (
                        <div key={index} className='flex flex-col gap-4 w-full h-full text-xl font-bold text-[#141414] border border-[#141414]/30 text-center justify-center'>
                            <p>Loading...</p>
                            <p>-</p>
                            <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                                <p>-</p>
                                <p>Loading...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md">
                <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-[16px]'>Statistik Gaji</p>
                        <p className='text-[24px] font-bold'>Rangkuman Data Gaji</p>
                    </div>
                </div>
                <div className='flex flex-row w-full h-full justify-center'>
                    {[1, 2].map((_, index) => (
                        <div key={index} className='flex flex-col gap-4 w-full h-full text-xl font-bold text-[#141414] border border-[#141414]/30 text-center justify-center'>
                            <p>No Data</p>
                            <p>0</p>
                            <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                                <p>0%</p>
                                <p>No data available</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

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
                    <p>Rp {data.total_salary.toLocaleString('id-ID')}</p>
                    <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                        <p>{data.percentage_change}%</p>
                        <p>dari bulan sebelumnya</p>
                    </div>
                </div>
                {/* Card Rata-rata Gaji */}
                <div className='flex flex-col gap-4 w-full h-full text-xl font-bold text-[#141414] border border-[#141414]/30 text-center justify-center'>
                    <p>Rerata Gaji Bulan Ini</p>
                    <p>Rp {data.average_salary.toLocaleString('id-ID')}</p>
                    <div className='flex flex-col text-[#1E3A5F] text-[16px] items-center'>
                        <p>{data.percentage_change}%</p>
                        <p>dari bulan sebelumnya</p>
                    </div>
                </div>
            </div>
        </div>
    );
}