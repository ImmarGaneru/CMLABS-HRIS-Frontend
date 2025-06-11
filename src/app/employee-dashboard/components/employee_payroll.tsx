'use client';
import { MdAttachMoney, MdCalendarToday } from 'react-icons/md';

interface PayrollSummary {
  current_salary: number;
  last_payment: string;
  payment_status: string;
}

interface EmployeePayrollProps {
  data: PayrollSummary | null;
}

export default function EmployeePayroll({ data }: EmployeePayrollProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Summary</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <MdAttachMoney className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Current Salary</p>
            <p className="text-xl font-semibold text-gray-800">
              {formatCurrency(data.current_salary)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MdCalendarToday className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Last Payment</p>
            <p className="text-gray-800">{formatDate(data.last_payment)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(data.payment_status)}`} />
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p className={`font-medium ${getStatusColor(data.payment_status)}`}>
              {data.payment_status.charAt(0).toUpperCase() + data.payment_status.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 