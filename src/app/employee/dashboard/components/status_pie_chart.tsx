'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StatusSummary {
  on_time: number;
  late: number;
  sick: number;
  permit: number;
  leave: number;
}

interface StatusPieChartProps {
  stats: StatusSummary | null;
  loading: boolean;
}

const COLORS = ['#1E3A5F', '#BA3C54', '#7CA5BF', '#FF8042', '#A0AEC0'];
const STATUS_LABELS = ['On Time', 'Late', 'Sick', 'Permit', 'Leave'];

const getPieData = (stats: StatusSummary | null) =>
  stats
    ? [
        { name: 'On Time', value: stats.on_time },
        { name: 'Late', value: stats.late },
        { name: 'Sick', value: stats.sick },
        { name: 'Permit', value: stats.permit },
        { name: 'Leave', value: stats.leave },
      ]
    : [];

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

export default function StatusPieChart({ stats, loading }: StatusPieChartProps) {
  const data = getPieData(stats);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[320px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Pie Chart</h3>
      {loading || !stats ? (
        <div className="flex justify-center items-center h-[200px]">
          <LoadingSpinner size={32} />
        </div>
      ) : total === 0 ? (
        <div className="flex justify-center items-center h-[200px] text-gray-500">No data available</div>
      ) : (
        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={200} height={200}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={50}
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
          <ul className="flex flex-col gap-2 w-fit">
            {data.map((item, index) => (
              <li key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-500">({item.value})</span>
                <span className="text-gray-400">({((item.value / total) * 100).toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 