'use client';
import { useEffect, useState } from 'react';
import { MdOutlineGroup } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import api from '@/lib/axios';

type ChartDataItem = {
    total: number;
    active: number;
    inactive: number;
    new_employees: number;
    last_updated: string;
}

export default function EmployeeSumCard() {
    const [chartData,setChartData] = useState<ChartDataItem | null>(null);
    const [loading, setLoading] = useState(true);
    // const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");

    useEffect(() => {
        const fetchEmployeeData = async () => {
            // try {
            //     setLoading(true);
            //     const response = await fetch('http://localhost:8000/api/admin/employees/dashboard/getEmployee', {
            //         headers: {
            //             'Authorization': `Bearer ${token}`
            //         }
            //     });

            //     if(response.status === 403){
            //         router.push('/unauthorized');
            //     }
            //     const result = await response.json();
            //     setData(result);
            // } catch (error) {
            //     console.error('Error fetching employee data:', error);
            // } finally {
            //     setLoading(false);
            // }
            try {
                const res = await api.get('/admin/employees/dashboard/getEmployee');

                if (res.data?.data) {
                    setChartData(res.data.data);
                } else {
                    setChartData(null);
                }

            } catch (error) {
                console.error('Gagal mengambil data:', error);
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeData();
    },[]);

    if (loading) {
        return (
            <div className='flex flex-row gap-6 w-full h-fit'>
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                        <div className='flex flex-row gap-2 items-center'>
                            <MdOutlineGroup size={32} />
                            <p className='text-[14px]'>Loading...</p>
                        </div>
                        <p className='text-[24px] font-bold'>-</p>
                        <p className='text-[14px]'>Loading...</p>
                    </div>
                ))}
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className='flex flex-row gap-6 w-full h-fit'>
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                        <div className='flex flex-row gap-2 items-center'>
                            <MdOutlineGroup size={32} />
                            <p className='text-[14px]'>No Data</p>
                        </div>
                        <p className='text-[24px] font-bold'>0</p>
                        <p className='text-[14px]'>No data available</p>
                    </div>
                ))}
            </div>
        );
    }

    return(
        <div className='flex flex-row gap-6 w-full h-fit'>
            {/* Card Total Karyawan */}
            <div className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Total Karyawan</p>
                </div>
                <p className='text-[24px] font-bold'>{chartData.total ?? 0}</p>
                <p className='text-[14px]'>Update: {chartData.last_updated ? dayjs(chartData.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>
            {/* Card Karyawan Aktif */}
            <div className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Aktif</p>
                </div>
                <p className='text-[24px] font-bold'>{chartData.active ?? 0}</p>
                <p className='text-[14px]'>Update: {chartData.last_updated ? dayjs(chartData.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>

            {/* Card Karyawan Baru */}
            <div className='bg-gray-50 text-[#257047] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Baru</p>
                </div>
                <p className='text-[24px] font-bold'>{chartData.new_employees ?? 0}</p>
                <p className='text-[14px]'>Update: {chartData.last_updated ? dayjs(chartData.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>

            {/* Card Karyawan Resign */}
            <div className='bg-gray-50 text-[#BA3C54] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Resign</p>
                </div>
                <p className='text-[24px] font-bold'>{chartData.inactive ?? 0}</p>
                <p className='text-[14px]'>Update: {chartData.last_updated ? dayjs(chartData.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>

        </div>
    );
}