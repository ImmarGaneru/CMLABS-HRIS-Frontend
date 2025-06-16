"use client";

import { FEEmployee } from "@/types/employee";

type Props = {
  employeesCard: FEEmployee[];
};

export default function EmployeeCardSum({ employeesCard }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const periode = today.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const totalEmployee = employeesCard.length;


  // Pegawai Tetap: tipe_kontrak === "Tetap" && status === "Active"
  const permanentEmployees = employeesCard.filter((emp) => {
    const tipe = emp.tipe_kontrak?.toLowerCase().trim();
    const status = emp.status?.toLowerCase().trim();
    return tipe === "tetap" && status === "active";
  }).length;

  // Karyawan Kontrak: tipe_kontrak === "Kontrak" && status === "Active"
  const contractEmployees = employeesCard.filter((emp) => {
    const tipe = emp.tipe_kontrak?.toLowerCase().trim();
    const status = emp.status?.toLowerCase().trim();
    return tipe === "kontrak" && status === "active";
  }).length;

  const internEmployees = employeesCard.filter((emp) => {
    const tipe = emp.tipe_kontrak?.toLowerCase().trim();
    const status = emp.status?.toLowerCase().trim();
    return tipe === "magang" && status === "active";
  }).length;

  // Karyawan Resign: status === "Resign"
  const resignedEmployees = employeesCard.filter((emp) => {
    return emp.status?.toLowerCase().trim() === "resign";
  }).length;

  const infoData = [
    { label: "Periode", value: periode },
    { label: "Total Karyawan", value: `${totalEmployee} Orang` },
    { label: "Pegawai Tetap", value: `${permanentEmployees} Orang` },
    { label: "Karyawan Kontrak", value: `${contractEmployees} Orang` },
    { label: "Karyawan Magang", value: `${internEmployees} Orang` },
    { label: "Karyawan Resign", value: `${resignedEmployees} Orang` },
  ];

  return (
    <div className="bg-[#f8f8f8] p-6 rounded-xl shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
