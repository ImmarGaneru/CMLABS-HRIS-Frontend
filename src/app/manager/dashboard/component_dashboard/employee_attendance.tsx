'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { IoMdArrowDropdown } from 'react-icons/io';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '@/lib/axios';

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ['#1E3A5F', '#BA3C54', '#7CA5BF', '#FF8042', '#A0AEC0'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const EmployeeAttendancePie: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceDate, setAttendanceDate] = useState<string | null>(null);

  const fetchData = async (date: Date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const res = await api.get(`/admin/employees/dashboard/attendance-summary?date=${formattedDate}`);
      if (res.data.meta?.success) {
        const result = res.data.data;
        setAttendanceDate(result.date);
        const chartData: DataItem[] = [
          { name: 'On Time', value: result['on-time'] ?? 0 },
          { name: 'Terlambat', value: result['late'] ?? 0 },
          { name: 'Izin', value: result['permit'] ?? 0 },
          { name: 'Sakit', value: result['sick'] ?? 0 },
          { name: 'Tidak Hadir', value: result['absent'] ?? 0 },
        ];
        setData(chartData);
      } else {
        setData([]);
        setAttendanceDate(null);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setData([]);
      setAttendanceDate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
      <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-[16px]'>Statistik Kehadiran</p>
          <p className='text-[24px] font-bold'>Data Kehadiran</p>
        </div>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            dateFormat="dd MMMM yyyy"
            className="flex flex-row items-center justify-between h-[56px] gap-2 border border-[#141414]/30 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer w-[200px]"
            wrapperClassName="w-fit"
            popperClassName="z-50"
            popperPlacement="bottom-end"
            customInput={
              <div>
                <span className='text-gray-700 text-[16px]'>
                  {selectedDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
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

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-[16px] text-gray-700">Loading data...</div>
        </div>
      ) : total === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-[16px] text-gray-700 text-center py-8">Tidak ada data kehadiran untuk tanggal ini.</div>
        </div>
      ) : (
        <div className='flex flex-row gap-4 items-center justify-between'>
          <div className='w-[300px] h-[300px] text-sm'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className='flex flex-col gap-4 w-fit'>
            {data.map((item, index) => (
              <li key={item.name} className='flex items-center gap-3'>
                <div className='w-3 h-3 rounded-full' style={{ backgroundColor: COLORS[index] }} />
                <span className='text-gray-700'>{item.name}</span>
                <span className='text-gray-500'>({item.value})</span>
                <span className='text-gray-400'>({((item.value / total) * 100).toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendancePie;
