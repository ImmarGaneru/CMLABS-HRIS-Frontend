"use client";

import { FEEmployee } from "@/types/employee";

type Props = {
  employeesCard: FEEmployee[];
};

export default function EmployeeCardSum({ employeesCard }: Props) {
  // Periode bulan dan tahun saat ini
  const periode = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Total karyawan
  const totalEmployee = employeesCard.length;

  // Hitung karyawan baru (misal dalam 30 hari terakhir)
  const newHires = employeesCard.filter((emp) => {
    const hireDate = new Date(emp.hireDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 30;
  }).length;

  // Pegawai tetap (status "Aktif")
  const permanentEmployees = employeesCard.filter(
    (emp) => emp.status === "Aktif"
  ).length;

  // Data untuk card
  const infoData = [
    { label: "Periode", value: periode },
    { label: "Total Karyawan", value: `${totalEmployee} Orang` },
    { label: "Karyawan Baru", value: `${newHires} Orang` },
    { label: "Pegawai Tetap", value: `${permanentEmployees} Orang` },
  ];

  return (
    <div className="bg-[#f8f8f8] p-6 rounded-xl shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoData.map((info, idx) => (
          <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm">
            <strong className="text-2xl">{info.value}</strong>
            <p className="text-sm text-gray-600 mt-1">{info.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}