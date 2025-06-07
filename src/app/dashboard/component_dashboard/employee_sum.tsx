'use client';
import { useEffect, useState } from 'react';
import { MdOutlineGroup } from 'react-icons/md';
import { useRouter } from 'next/navigation'; 
import dayjs from 'dayjs';

export default function EmployeeSumCard() {
    const router = useRouter();
    const [data,setData] = useState({
        total: 0,
        active: 0,
        new: 0,
        resigned: 0,
        last_updated: ''
    });
    const [loading, setLoading] = useState(true);
    const [token] = useState("9|CmySPq9oHzxlzpNsWbCXLO6YKOrJhskTj3jOoGi4ff89bed8");

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/admin/employees/dashboard/getEmployee', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(response.status === 403){
                    router.push('/unauthorized');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployeeData();
    },[token, router]);

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

    if (!data || (data.total === 0 && data.active === 0 && data.new === 0 && data.resigned === 0)) {
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
                <p className='text-[24px] font-bold'>{data.total ?? 0}</p>
                <p className='text-[14px]'>Update: {data.last_updated ? dayjs(data.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>
            {/* Card Karyawan Aktif */}
            <div className='bg-gray-50 text-[#1E3A5F] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Aktif</p>
                </div>
                <p className='text-[24px] font-bold'>{data.active ?? 0}</p>
                <p className='text-[14px]'>Update: {data.last_updated ? dayjs(data.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>
            
            {/* Card Karyawan Baru */}
            <div className='bg-gray-50 text-[#257047] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Baru</p>
                </div>
                <p className='text-[24px] font-bold'>{data.new ?? 0}</p>
                <p className='text-[14px]'>Update: {data.last_updated ? dayjs(data.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>

            {/* Card Karyawan Resign */}
            <div className='bg-gray-50 text-[#BA3C54] rounded-lg flex flex-col gap-2 px-8 py-8 h-[160px] w-full items-start shadow-md'>
                {/* Tittle */}
                <div className='flex flex-row gap-2 items-center'>
                    <MdOutlineGroup size={32} />
                    <p className='text-[14px]'>Karyawan Resign</p>
                </div>
                <p className='text-[24px] font-bold'>{data.resigned ?? 0}</p>
                <p className='text-[14px]'>Update: {data.last_updated ? dayjs(data.last_updated).format('DD MM YYYY') : '-'}</p>
            </div>

        </div>
    );
}