"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Building2, Briefcase } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  address: string;
  employees_count: number;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/company');
        setCompany(res.data.data);
        setError('');
      } catch {
        setError('Gagal mengambil data perusahaan');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  return (
    <div className="p-8 min-h-screen flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1E3A5F] mb-4">Settings</h1>
      {/* Company Card */}
      <div className="w-full bg-[#f8f8f8] rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {loading ? (
          <span>Loading company info...</span>
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : company ? (
          <>
            <div className="flex-1">
              <div className="text-xl font-bold text-[#1E3A5F]">{company.name}</div>
              <div className="text-gray-700 mt-1">{company.address}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">Total Employees</span>
              <span className="text-2xl font-bold text-[#1E3A5F]">{company.employees_count}</span>
            </div>
          </>
        ) : null}
      </div>
      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/manager/settings/department" className="flex items-center gap-4 px-6 py-6 bg-[#f8f8f8] rounded-lg shadow hover:bg-[#e0e7ef] transition">
          <div className="bg-[#1E3A5F] text-white rounded-full p-3">
            <Building2 size={32} />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#1E3A5F]">Manage Departments</div>
            <div className="text-gray-600 text-sm mt-1">Tambah, ubah dan atur departemen dalam Perusahaanmu.</div>
          </div>
        </Link>
        <Link href="/manager/settings/position" className="flex items-center gap-4 px-6 py-6 bg-[#f8f8f8] rounded-lg shadow hover:bg-[#e0e7ef] transition">
          <div className="bg-[#1E3A5F] text-white rounded-full p-3">
            <Briefcase size={32} />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#1E3A5F]">Manage Positions</div>
            <div className="text-gray-600 text-sm mt-1">Tambah, ubah dan atur posisi dalam departement.</div>
          </div>
        </Link>
      </div>
    </div>
  );
} 