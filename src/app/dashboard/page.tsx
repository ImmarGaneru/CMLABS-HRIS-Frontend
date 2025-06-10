'use client';
import ApprovalSum from './component_dashboard/approval_sum';
import EmployeeAttendancePie from './component_dashboard/employee_attendance';
import EmployeePayrollSummary from './component_dashboard/employee_payroll';
import EmployeeStat from './component_dashboard/employee_stat';
import EmployeeSumCard from './component_dashboard/employee_sum';
import EmployeeType from './component_dashboard/employee_type';
import Tutorial from '@/components/Tutorial';
import { useEffect, useState } from 'react';
import ClockStatus from './component_dashboard/clock_status';
import DepartmentDistribution from './component_dashboard/department_distribution';
import { dashboardTutorialSteps } from '../tutorial/dashboard_tutorial';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add loading state management
    const initializeDashboard = async () => {
      try {
        // Add your data fetching logic here
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
      <Tutorial 
        steps={dashboardTutorialSteps}
        storageKey="dashboardTutorialCompleted"
        buttonPosition="bottom-right"
        buttonVariant="floating"
      />
      
      {/* Top Row - Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="employee-sum-card">
          <EmployeeSumCard/>
        </div>
      </div>

      {/* Middle Row - Statistics and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="employee-stat">
          <EmployeeStat/>
        </div>
        <div className="employee-attendance">
          <EmployeeAttendancePie/>
        </div>
      </div>

      {/* Bottom Row - Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="employee-type">
          <EmployeeType/>
        </div>
        <div className="approval-sum">
          <ApprovalSum/>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="clock-status">
          <ClockStatus/>
        </div>
        <div className="department-distribution">
          <DepartmentDistribution/>
        </div>
      </div>
    </section>
  );
}
