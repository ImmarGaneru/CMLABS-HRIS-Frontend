'use client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface WorkHoursCardProps {
  workHours: number | null;
  loading: boolean;
}

export default function WorkHoursCard({ workHours, loading }: WorkHoursCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Work Hours This Month</h3>
      {loading ? (
        <LoadingSpinner size={32} />
      ) : (
        <p className="text-3xl font-bold text-blue-700">{workHours !== null ? workHours.toFixed(2) : '-'}</p>
      )}
    </div>
  );
} 