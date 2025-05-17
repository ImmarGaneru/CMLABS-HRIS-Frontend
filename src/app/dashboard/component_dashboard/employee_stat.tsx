'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const data = [
  { label: 'Aktif', total: 133 },
  { label: 'Baru', total: 10 },
  { label: 'Resign', total: 7 },
];

const COLORS = {
  'Aktif': '#1E3A5F',
  'Baru': '#7CA5BF',
  'Resign': '#BA3C54'
};

export default function EmployeeStat() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const handleMonthChange = (date: Date | null) => {
    if (date) {
      setSelectedMonth(date);
      // Here you can add logic to fetch new data based on the selected month
      console.log('Selected month:', date);
    }
  };

  return (
    <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
      {/* Top bar */}
      <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-[16px]'>Statistik Karyawan</p>
          <p className='text-[24px] font-bold'>Jumlah Karyawan</p>
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.label as keyof typeof COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}