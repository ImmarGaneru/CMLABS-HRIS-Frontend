'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'On Time', total: 80 },
  { name: 'Late', total: 10 },
  { name: 'Absent', total: 15 },
];

export default function BarChartExample() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}