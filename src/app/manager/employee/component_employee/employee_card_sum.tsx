"use client";

interface Employee {
  id: string;
  nama: string;
  jenis_kelamin: string;
  no_telp: string;
  cabang: string;
  jabatan: string;
  status: string;
  start_date: string;
  tipe_kontrak: string;
  created_at: any;
  avatar: any;
}

type Props = {
  employeesCard: Employee[];
};

export default function EmployeeCardSum({ employeesCard }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const periode = today.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // Count employees by tipe_kontrak with status "active"
  const activeEmployees = employeesCard.filter((emp) => 
    emp.status?.toLowerCase().trim() === "active"
  );

  // Pegawai Tetap: tipe_kontrak === "Tetap" && status === "Active"
  const permanentEmployees = activeEmployees.filter((emp) => 
    emp.tipe_kontrak?.toLowerCase().trim() === "tetap"
  ).length;

  // Karyawan Kontrak: tipe_kontrak === "Kontrak" && status === "Active"
  const contractEmployees = activeEmployees.filter((emp) => 
    emp.tipe_kontrak?.toLowerCase().trim() === "kontrak"
  ).length;

  // Karyawan Lepas: tipe_kontrak === "Lepas" && status === "Active"
  const internEmployees = activeEmployees.filter((emp) => 
    emp.tipe_kontrak?.toLowerCase().trim() === "lepas"
  ).length;

  const infoData = [
    { label: "Periode", value: periode },
    { label: "Pegawai Tetap", value: `${permanentEmployees} Orang` },
    { label: "Karyawan Kontrak", value: `${contractEmployees} Orang` },
    { label: "Karyawan Lepas", value: `${internEmployees} Orang` },
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
