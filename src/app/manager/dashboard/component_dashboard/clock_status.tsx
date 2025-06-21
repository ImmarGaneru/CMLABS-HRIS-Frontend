'use client';
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface ClockStatusData {
  isClockedIn: boolean;
  lastClockTime: string;
  status: 'on-time' | 'late' | 'early';
}

export default function ClockStatus() {
  const [clockStatus, setClockStatus] = useState<ClockStatusData | null>(null);

  useEffect(() => {
    const fetchClockStatus = async () => {
      try {
        // Buat api sek nunggu controller
        // const response = await fetch('/api/attendance/status');
        // const data = await response.json();
        // setClockStatus(data);
      } catch (error) {
        console.error('Error fetching clock status:', error);
      }
    };

    fetchClockStatus();
    const interval = setInterval(fetchClockStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
      <div className='bg-[#F8F8F8] text-gray-900 flex flex-col w-full min-w-[480px] h-[440px] px-8 py-8 gap-2 rounded-2xl shadow-md'>
        {/* Top bar */}
        <div className='flex flex-row w-full justify-between border-b-4 border-[#141414] gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-[16px]'>Status Kehadiran</p>
            <p className='text-[24px] font-bold'>Status Clock In/Out</p>
          </div>
          <div className="flex items-center">
            <Clock size={32} className="text-[#1E3A5F]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 mt-4">
          {clockStatus ? (
              <>
                <div className="flex items-center gap-4">
                  {clockStatus.isClockedIn ? (
                      <CheckCircle className="h-8 w-8 text-[#257047]" />
                  ) : (
                      <XCircle className="h-8 w-8 text-[#BA3C54]" />
                  )}
                  <span className="text-[24px] font-bold">
                {clockStatus.isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] text-gray-700">
                    Last clock: {clockStatus.lastClockTime}
                  </p>
                  <div className="mt-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[14px] font-medium
                  ${clockStatus.status === 'on-time' ? 'bg-[#257047]/10 text-[#257047]' :
                    clockStatus.status === 'late' ? 'bg-[#BA3C54]/10 text-[#BA3C54]' :
                        'bg-[#7CA5BF]/10 text-[#7CA5BF]'}`}>
                  {clockStatus.status.charAt(0).toUpperCase() + clockStatus.status.slice(1)}
                </span>
                  </div>
                </div>
              </>
          ) : (
              <div className="text-[16px] text-gray-700">Loading status...</div>
          )}
        </div>
      </div>
  );
} 