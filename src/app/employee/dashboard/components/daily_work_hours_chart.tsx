'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DailyWorkHoursChartProps {
  data: { date: string; hours: number }[];
  loading: boolean;
}

const BAR_COLOR = '#1E3A5F';

export default function DailyWorkHoursChart({ data, loading }: DailyWorkHoursChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[320px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Work Hours</h3>
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 