'use client';
import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { IoMdArrowDropdown } from "react-icons/io";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Approval {
  id: number;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  requester: string;
  date: string;
}

export default function RecentApprovals() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/approvals/recent');
        // const data = await response.json();
        // setApprovals(data);
      } catch (error) {
        console.error('Error fetching approvals:', error);
      }
    };

    fetchApprovals();
  }, []);

  const handleMonthChange = (date: Date | null) => {
    if (date) {
      setSelectedMonth(date);
      // Here you can add logic to fetch new data based on the selected month
      console.log('Selected month:', date);
    }
  };

  return (
    <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
      {/* Top bar */}
      <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-[16px]'>Persetujuan</p>
          <p className='text-[24px] font-bold'>Persetujuan Terbaru</p>
        </div>
        <div className="flex items-center gap-4">
          <ClipboardList size={32} className="text-[#1E3A5F]" />
          <DatePicker
            selected={selectedMonth}
            onChange={handleMonthChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            className="flex flex-row items-center justify-between h-[56px] gap-2 border border-[#141414]/30 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer w-[200px]"
            wrapperClassName="w-fit"
            popperClassName="z-50"
            popperPlacement="bottom-end"
            customInput={
              <div>
                <span className='text-gray-700 text-[16px]'>
                  {selectedMonth.toLocaleDateString('id-ID', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <IoMdArrowDropdown size={24} className="text-gray-500" />
              </div>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 mt-4 overflow-y-auto">
        {approvals.length > 0 ? (
          approvals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="space-y-1">
                <p className="text-[16px] font-medium text-[#1E3A5F]">{approval.type}</p>
                <p className="text-[14px] text-gray-600">{approval.requester}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[14px] font-medium
                  ${approval.status === 'approved' ? 'bg-[#257047]/10 text-[#257047]' :
                    approval.status === 'rejected' ? 'bg-[#BA3C54]/10 text-[#BA3C54]' :
                    'bg-[#7CA5BF]/10 text-[#7CA5BF]'}`}>
                  {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                </span>
                <span className="text-[14px] text-gray-600">{approval.date}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[16px] text-gray-700 text-center py-8">No recent approvals</div>
        )}
      </div>
    </div>
  );
} 