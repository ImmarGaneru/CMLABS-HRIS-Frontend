'use client';
import ApprovalSum from './component_dashboard/approval_sum';
import EmployeeAttendancePie from './component_dashboard/employee_attendance';
import EmployeePayrollSummary from './component_dashboard/employee_payroll';
import EmployeeStat from './component_dashboard/employee_stat';
import EmployeeSumCard from './component_dashboard/employee_sum';
import EmployeeType from './component_dashboard/employee_type';
import Tutorial from '@/components/Tutorial';

import { MdOutlineGroup } from 'react-icons/md';

type TutorialStep = {
  target: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
};

const dashboardSteps: TutorialStep[] = [
  {
    target: '.employee-sum-card',
    content: 'Welcome to HRIS! Here you can see a summary of employee statistics.',
    placement: 'bottom',
  },
  {
    target: '.employee-stat',
    content: 'This section shows detailed employee statistics and trends.',
    placement: 'right',
  },
  {
    target: '.employee-attendance',
    content: 'View attendance patterns and statistics in this section.',
    placement: 'left',
  },
  {
    target: '.employee-type',
    content: 'Here you can see the distribution of employee types.',
    placement: 'right',
  },
  {
    target: '.employee-payroll',
    content: 'Access payroll summaries and financial information here.',
    placement: 'left',
  },
  {
    target: '.approval-sum',
    content: 'Track and manage approval requests in this section.',
    placement: 'right',
  },
];

export default function DashboardPage() {
  return (
    <section className="flex flex-col px-2 py-4 gap-6 w-full h-fit">
      {/* Rangkuman Data Karyawan */}
      <div className="employee-sum-card">
        <EmployeeSumCard/>
      </div>
      <div className='grid grid-cols-2 gap-4 w-full'>
        {/* Rangkuman Tabel Statistik Dashboard */}
        <div className="employee-stat">
          <EmployeeStat/>
        </div>
        <div className="employee-attendance">
          <EmployeeAttendancePie/>
        </div>
        <div className="employee-type">
          <EmployeeType/>
        </div>
        <div className="employee-payroll">
          <EmployeePayrollSummary/>
        </div>
        <div className="approval-sum">
          <ApprovalSum/>
        </div>
      </div>
      <Tutorial 
        steps={dashboardSteps}
        storageKey="dashboardTutorialCompleted"
        buttonPosition="top-right"
      />
    </section>
  );
}
