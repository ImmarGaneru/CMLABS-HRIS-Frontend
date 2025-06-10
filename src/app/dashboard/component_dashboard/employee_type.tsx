'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '@/lib/axios';

type ContractStat = {
  label: string;
  total: number;
};

export default function EmployeeType() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<ContractStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");
      
  const handleMonthChange = (date: Date | null) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  const getColor = (label: string): string => {
    const colorMap = {
      'Tetap': '#1E3A5F',
      'Kontrak': '#7CA5BF',
      'Lepas': '#BA3C54'
    };
  
    return colorMap[label as keyof typeof colorMap] || '#ccc';
  };

  useEffect(() => {
    const fetchChartData = async () => {
      // const token = localStorage.getItem('auth_token'); // atau gunakan Zustand store
      const year = selectedMonth.getFullYear();
      const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');

      try {
        const res = await api.get(`/admin/employees/dashboard/contract-stats?month=${month}&year=${year}`)
        if (Array.isArray(res.data.data?.data)) {
          setChartData(res.data.data.data);
        } else {
          setChartData([]);
        }

      } catch (error) {
        console.error('Gagal mengambil data:', error);
        setChartData([]);
      } finally{
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
        <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-[16px]'>Statistik Karyawan</p>
            <p className='text-[24px] font-bold'>Kontrak Karyawan</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-[16px] text-gray-700">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
        <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-[16px]'>Statistik Karyawan</p>
            <p className='text-[24px] font-bold'>Kontrak Karyawan</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-[16px] text-gray-700 text-center py-8">No data available for the selected period</div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
      {/* Top bar */}
      <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-[16px]'>Statistik Karyawan</p>
          <p className='text-[24px] font-bold'>Kontrak Karyawan</p>
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
              <div className="flex items-center justify-between w-full">
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

      {/* Charts Container */}
      <div className='flex flex-col gap-8'>
        {/* Contract Type Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" width={100} />
              <Tooltip />
              <Bar dataKey="total">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.label)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}