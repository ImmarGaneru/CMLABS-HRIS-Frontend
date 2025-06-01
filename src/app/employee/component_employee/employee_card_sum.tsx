"use client";

type Employee = {
  id: number;
  hireDate: string;         // misal tanggal masuk kerja, format ISO string
  employmentType: string;   // misal "Full Time" atau "Part Time"
  // properti lain jika ada
};

type Props = {
  employees: Employee[];
};

export default function EmployeeCardSum({ employees }: Props) {
  // Periode: misal bulan dan tahun sekarang
  const periode = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // Total karyawan
  const totalEmployee = employees.length;

  // Total New Hire (misal yang hireDate di tahun 2025)
  const totalNewHire = employees.filter((emp) => {
    const year = new Date(emp.hireDate).getFullYear();
    return year === 2025;
  }).length;

  // Full Time Employee (misal employmentType = "Full Time")
  const fullTimeEmployee = employees.filter(
    (emp) => emp.employmentType === "Full Time"
  ).length;

  // Array informasi dinamis yang akan di-render
  const infoData = [
    { label: "Periode", value: periode },
    { label: "Total Employee", value: `${totalEmployee} Employee` },
    { label: "Total New Hire", value: `${totalNewHire} Person` },
    { label: "Full Time Employee", value: `${fullTimeEmployee} Full Time` },
  ];

  return (
    <div className="bg-[#f8f8f8] p-6 rounded-xl shadow-md">
      <div className="flex justify-between gap-4">
        {infoData.map((info, idx) => (
          <div key={idx} className="flex-1 text-center">
            <strong className="text-xl">{info.value}</strong>
            <p className="text-sm text-gray-500">{info.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
