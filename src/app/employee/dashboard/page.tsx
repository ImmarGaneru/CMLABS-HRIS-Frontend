'use client';
import { useEffect, useState } from 'react';
import EmployeeProfile from './components/employee_profile';
import api from '@/lib/axios';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import WorkHoursCard from './components/work_hours_card';
import DailyWorkHoursChart from './components/daily_work_hours_chart';
import StatusSummaryCard from './components/status_summary_card';
import StatusPieChart from './components/status_pie_chart';

export default function EmployeeDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/user/dashboard/daily-attendance');
        setDashboardData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  // Prepare profile data for EmployeeProfile
  const profileData = dashboardData?.user?.employee
    ? {
        ...dashboardData.user.employee,
        user: {
          email: dashboardData.user.email,
          phone: dashboardData.user.phone_number,
        },
      }
    : null;

  // Prepare work hours
  const workHours = dashboardData?.total_work_hours ?? null;
  // Prepare daily work hours data
  const dailyWorkHours = dashboardData?.daily_attendance ?? [];
  // Prepare status summary
  const statusStats = dashboardData?.attendance_stats ?? null;

  return (
    <section className="flex flex-col px-2 md:px-4 py-6 gap-6 w-full h-fit">
      {/* Profile Section */}
      <div className="grid grid-cols-1 gap-4">
        <div className="employee-profile">
          <EmployeeProfile data={profileData} />
        </div>
      </div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
        <div className="flex flex-col gap-4 h-full">
          <WorkHoursCard workHours={workHours} loading={isLoading} />
          <StatusSummaryCard stats={statusStats} loading={isLoading} />
        </div>
        <div className="grid grid-cols-1 h-full">
          <StatusPieChart stats={statusStats} loading={isLoading} />
        </div>
      </div>
      <div className="grid grid-cols-1">
        <DailyWorkHoursChart data={dailyWorkHours} loading={isLoading} />
      </div>
    </section>
  );
} 