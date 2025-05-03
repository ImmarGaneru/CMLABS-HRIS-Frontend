'use client';
import EmployeeAttendancePie from '../component/dashboard/employee_attendance';
import EmployeeStat from '../component/dashboard/employee_stat';
import EmployeeSumCard from '../component/dashboard/employee_sum';
import EmployeeType from '../component/dashboard/employee_type';

import BarChartExample from './barchartexample';
import PieChartExample from './piechartexample';

import { MdOutlineGroup } from 'react-icons/md';
export default function DashboardPage() {
  return (
    <section className="bg-gray-300 flex flex-col px-2 py-4 gap-6 w-full h-fit">
      {/* Rangkuman Data Karyawan */}
      <EmployeeSumCard/>
      <div className='flex flex-wrap justify-center items-start gap-4'>
        {/* Rangkuman Tabel Statistik Dashboard */}
        <EmployeeStat/>
        <EmployeeAttendancePie/>
        <EmployeeType/>
      </div>
    </section>
  );
}
