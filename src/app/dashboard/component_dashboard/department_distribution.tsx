'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Building2 } from 'lucide-react';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

const COLORS = {
  'IT': '#1E3A5F',
  'HR': '#7CA5BF',
  'Finance': '#BA3C54',
  'Marketing': '#257047',
  'Operations': '#7CA5BF'
};

export default function DepartmentDistribution() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/departments/distribution');
        // const data = await response.json();
        // setDepartments(data.map((dept: any) => ({
        //   ...dept,
        //   color: COLORS[dept.name as keyof typeof COLORS] || '#1E3A5F'
        // })));
      } catch (error) {
        console.error('Error fetching department distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
          <p className='text-[16px]'>Departemen</p>
          <p className='text-[24px] font-bold'>Distribusi Departemen</p>
        </div>
        <div className="flex items-center gap-4">
          <Building2 size={32} className="text-[#1E3A5F]" />
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

      {/* Chart */}
      <div className="h-[300px] mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[16px] text-gray-700">Loading distribution...</div>
          </div>
        ) : departments.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departments}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[16px] text-gray-700 text-center py-8">No department data available for the selected period</div>
          </div>
        )}
      </div>
    </div>
  );
} 