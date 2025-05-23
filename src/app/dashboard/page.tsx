'use client';
import ApprovalSum from './component_dashboard/approval_sum';
import EmployeeAttendancePie from './component_dashboard/employee_attendance';
import EmployeePayrollSummary from './component_dashboard/employee_payroll';
import EmployeeStat from './component_dashboard/employee_stat';
import EmployeeSumCard from './component_dashboard/employee_sum';
import EmployeeType from './component_dashboard/employee_type';

import { MdOutlineGroup } from 'react-icons/md';
export default function DashboardPage() {
  return (
    <section className="flex flex-col px-2 py-4 gap-6 w-full h-fit">
      {/* Rangkuman Data Karyawan */}
      <EmployeeSumCard/>
      <div className='grid grid-cols-2 gap-4 w-full'>
        {/* Rangkuman Tabel Statistik Dashboard */}
        <EmployeeStat/>
        <EmployeeAttendancePie/>
        <EmployeeType/>
        <EmployeePayrollSummary/>
        <ApprovalSum/>
      </div>
    </section>
  );
}
