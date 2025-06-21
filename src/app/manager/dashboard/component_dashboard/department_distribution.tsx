'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Building2 } from 'lucide-react';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '@/lib/axios';

interface DepartmentData {
  id: string;
  name: string;
  value: number;
  color: string;
  positions?: PositionData[];
}

interface PositionData {
  id: string;
  name: string;
  level: string;
}

const COLORS = {
  'IT': '#1E3A5F',
  'HR': '#7CA5BF',
  'Finance': '#BA3C54',
  'Marketing': '#257047',
  'Sales': '#7CA5BF',
  'Operations': '#7CA5BF'
};

export default function DepartmentDistribution() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/departments');
        if (response.data.meta.success) {
          // Transform the data to include position counts
          const departmentsData = await Promise.all(
            response.data.data.map(async (dept: any) => {
              // Fetch positions for each department
              const positionsResponse = await api.get(`/admin/departments/${dept.id}`);
              const positions = positionsResponse.data.meta.success ? positionsResponse.data.data : [];
              
              return {
                id: dept.id,
                name: dept.name,
                value: positions.length, // Use number of positions as value
                color: COLORS[dept.name as keyof typeof COLORS] || '#1E3A5F',
                positions: positions
              };
            })
          );
          setDepartments(departmentsData);
        }
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

  const handleDepartmentClick = (department: DepartmentData) => {
    setSelectedDepartment(selectedDepartment === department.id ? null : department.id);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p>Positions: {data.value}</p>
          {data.positions && (
            <div className="mt-2">
              <p className="font-semibold">Positions:</p>
              <ul className="list-disc pl-4">
                {data.positions.map((pos: PositionData) => (
                  <li key={pos.id}>{pos.name} (Level {pos.level})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
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
                onClick={(data) => handleDepartmentClick(data)}
              >
                {departments.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[16px] text-gray-700 text-center py-8">No department data available for the selected period</div>
          </div>
        )}
      </div>
  );
}