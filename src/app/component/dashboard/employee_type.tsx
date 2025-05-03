'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const contractData = [
  { label: 'Tetap', total: 85 },
  { label: 'Kontrak', total: 45 },
  { label: 'Lepas', total: 20 },
];

const COLORS = {
  'Tetap': '#1E3A5F',
  'Kontrak': '#7CA5BF',
  'Lepas': '#BA3C54'
};

export default function EmployeeType() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const handleMonthChange = (date: Date | null) => {
    if (date) {
      setSelectedMonth(date);
      // Here you can add logic to fetch new data based on the selected month
      console.log('Selected month:', date);
    }
  };

  return (
    <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl'>
      {/* Top bar */}
      <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-[16px]'>Statistik Karyawan</p>
          <p className='text-[24px] font-bold'>Rangkuman Kontrak Karyawan</p>
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
      
      {/* Charts Container */}
      <div className='flex flex-col gap-8'>
        {/* Contract Type Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={contractData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" width={100} />
              <Tooltip />
              <Bar dataKey="total">
                {contractData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.label as keyof typeof COLORS]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}