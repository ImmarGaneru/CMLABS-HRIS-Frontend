'use client';
import { MdAccessTime, MdCheckCircle, MdSchedule } from 'react-icons/md';

interface AttendanceData {
  status: string;
  check_in: string;
  check_out: string;
}

interface EmployeeAttendanceProps {
  data: AttendanceData | null;
}

export default function EmployeeAttendance({ data }: EmployeeAttendanceProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'text-green-500';
      case 'late':
        return 'text-yellow-500';
      case 'absent':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <MdCheckCircle className={`w-5 h-5 ${getStatusColor(data.status)}`} />
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-medium ${getStatusColor(data.status)}`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MdAccessTime className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Check In</p>
            <p className="text-gray-800">{data.check_in}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MdSchedule className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Check Out</p>
            <p className="text-gray-800">{data.check_out}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 