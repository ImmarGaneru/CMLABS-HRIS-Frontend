
'use client';

import { useEffect, useState } from 'react';
import KeamananURL from '@/app/auth/login/keamanan_url/page'; // atau path yang benar seperti @/components/KeamananURL
import EmployeeProfile from './components/employee_profile';
import EmployeeAttendance from './components/employee_attendance';
import EmployeePayroll from './components/employee_payroll';
import api from '@/lib/axios';

// 👇 Ini adalah komponen isi dashboard, hanya dipanggil jika role sudah benar
function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const response = await api.get('/employee/dashboard');
        setDashboardData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col px-4 py-6 gap-6 w-full h-fit">
      {/* Profile Section */}
      <div className="grid grid-cols-1 gap-4">
        <div className="employee-profile">
          <EmployeeProfile data={dashboardData?.employee} />
        </div>
      </div>

      {/* Attendance and Payroll Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="employee-attendance">
          <EmployeeAttendance data={dashboardData?.attendance_today} />
        </div>
        <div className="employee-payroll">
          <EmployeePayroll data={dashboardData?.payroll_summary} />
        </div>
      </div>
    </section>
  );
}

// 👇 Export utama halaman dashboard: dilindungi oleh role "employee"
export default function EmployeeDashboardPage() {
  return (
    <KeamananURL role="employee">
      <DashboardContent />
    </KeamananURL>
  );
}