'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Building2 } from 'lucide-react';
import { IoMdArrowDropdown } from "react-icons/io";
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
  department: {
    id: string;
    name: string;
  };
}

const COLOR_PALETTE = [
  "#1E3A5F", "#7CA5BF", "#BA3C54"
];

export default function DepartmentDistribution() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all departments
        const deptRes = await api.get('/admin/departments');
        // Fetch all positions
        const posRes = await api.get('/admin/positions');
        if (deptRes.data.meta.success && posRes.data.meta.success) {
          const departmentsRaw = deptRes.data.data;
          const positionsRaw: PositionData[] = posRes.data.data;

          // Map department id to positions
          const deptMap: Record<string, PositionData[]> = {};
          positionsRaw.forEach((pos) => {
            const deptId = pos.department?.id;
            if (deptId) {
              if (!deptMap[deptId]) deptMap[deptId] = [];
              deptMap[deptId].push(pos);
            }
          });

          // Build DepartmentData[] with dynamic colors
          const departmentsData: DepartmentData[] = departmentsRaw.map((dept: any, idx: number) => ({
            id: dept.id,
            name: dept.name,
            value: deptMap[dept.id]?.length || 0,
            color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
            positions: deptMap[dept.id] || [],
          }));

          setDepartments(departmentsData);
        }
      } catch (error) {
        console.error('Error fetching department distribution:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          {data.positions && data.positions.length > 0 && (
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

  const getColor = (name: string): string => {
    if (name === 'Lepas' || name === 'Tidak Aktif') return '#BA3C54';
    return '#1E3A5F';
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
              <BarChart data={departments} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Positions" radius={[40, 40, 0, 0]}>
                  {departments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
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