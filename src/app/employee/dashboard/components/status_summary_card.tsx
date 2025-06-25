'use client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StatusSummary {
  on_time: number;
  late: number;
  sick: number;
  permit: number;
  leave: number;
}

interface StatusSummaryCardProps {
  stats: StatusSummary | null;
  loading: boolean;
}

const STATUS_LABELS: { [key: string]: string } = {
  on_time: 'On Time',
  late: 'Late',
  sick: 'Sick',
  permit: 'Permit',
  leave: 'Leave',
};

export default function StatusSummaryCard({ stats, loading }: StatusSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Summary</h3>
      {loading || !stats ? (
        <div className="flex justify-center items-center h-[80px]">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <div className="flex justify-between">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-md text-gray-500">{label}</span>
              <span className="text-xl font-bold text-blue-700">{stats[key as keyof StatusSummary]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 