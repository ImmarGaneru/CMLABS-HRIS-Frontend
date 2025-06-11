'use client';
import { MdPerson, MdWork, MdEmail, MdPhone } from 'react-icons/md';

interface EmployeeProfileProps {
  data: {
    first_name: string;
    last_name: string;
    position?: {
      name: string;
    };
    user?: {
      email: string;
      phone: string;
    };
  } | null;
}

export default function EmployeeProfile({ data }: EmployeeProfileProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <MdPerson className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {data.first_name} {data.last_name}
          </h2>
          <p className="text-gray-600">{data.position?.name || 'No Position'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <MdWork className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="text-gray-800">{data.position?.name || 'No Position'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MdEmail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{data.user?.email || 'No Email'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MdPhone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800">{data.user?.phone || 'No Phone'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 