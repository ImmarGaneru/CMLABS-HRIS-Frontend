"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Karyawan = {
  id: string;
  name: string;
  photo: string;
  position: string;
  nik: string;
  address: string;
  birthplace: string;
  birthdate: string;
  gender: string;
  education: string;
  email: string;
  phone: string;
  startDate: string;
  tenure: string;
  endDate: string;
  schedule: string;
  contractType: string;
  branch: string;
  status: string;
  effectiveDate: string;
  bank: string;
  bankAccount: string;
  basicSalary: string;
  overtimePay: string;
  latePenalty: string;
  totalSalary: string;
};

export default function DetailKaryawan() {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const employeeDocuments = [
    { name: "KTP", file: "ktp_ahmad.pdf" },
    { name: "Ijazah", file: "ijazah_s2.pdf" },
    { name: "Kontrak Kerja", file: "kontrak_2020.pdf" },
  ];
  useEffect(() => {
    // Simulate fetching the employee data (use API for real data)
    // Replace with real data fetching from an API
    const fetchedKaryawan: Karyawan = {
      id: "1",
      name: "John Doe",
      photo: "/default.jpg",
      position: "Manager",
      nik: "1234567890",
      address: "Jl. Merdeka No. 10",
      birthdate: "1990-01-01",
      birthplace: "Jakarta",
      gender: "Male",
      education: "S1 Teknik Informatika",
      email: "johndoe@example.com",
      phone: "08123456789",
      startDate: "2020-01-01",
      tenure: "5 years",
      endDate: "",
      schedule: "Monday - Friday, 9 AM - 5 PM",
      contractType: "Permanent",
      branch: "Head Office",
      status: "Active",
      effectiveDate: "2020-01-01",
      bank: "BCA",
      bankAccount: "1234567890123456",
      basicSalary: "10000000",
      overtimePay: "2000000",
      latePenalty: "500000",
      totalSalary: "12000000",
    };
    setKaryawan(fetchedKaryawan);
  }, []);

  const formatRupiah = (value: string | number | undefined) =>
    value ? `Rp ${Number(value).toLocaleString("id-ID")}` : "-";

  return (
    <div className="p-6 bg-white rounded shadow w-full mt-2 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#141414]">Detail Karyawan</h1>
        <button
          onClick={() => router.push("/employee")}
          className="flex items-center bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali
        </button>
      </div>

      {karyawan ? (
        <div className="flex flex-col md:flex-row gap-20 items-start">
          {/* Foto dan Identitas */}
          <div className="flex flex-col items-start justify-start mb-6">
            <div className="w-40 h-40 overflow-hidden mb-3 bg-gray-200 rectangle-full">
              <Image
                src={karyawan.photo || "/default.jpg"}
                alt={karyawan.name || "Karyawan"}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-bold text-lg">{karyawan.name}</p>
            <p className="text-sm text-gray-500">{karyawan.position}</p>
          </div>

          {/* Info Detail */}
          <div className="flex-1 flex flex-col gap-y-10">
            {/* Informasi Pribadi */}
            <div>
              <h2 className="text-xl font-semibold text-[#141414] mb-4">
                Informasi Pribadi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <FieldRow label="NIK" value={karyawan.nik} />
                <FieldRow label="Alamat" value={karyawan.address} />
                <FieldRow
                  label="Tempat, Tgl Lahir"
                  value={`${karyawan.birthplace}, ${karyawan.birthdate}`}
                />
                <FieldRow label="Jenis Kelamin" value={karyawan.gender} />
                <FieldRow
                  label="Pendidikan Terakhir"
                  value={karyawan.education}
                />
                <FieldRow label="Email" value={karyawan.email} />
                <FieldRow label="No Telp" value={karyawan.phone} />
              </div>
            </div>

            {/* Informasi Kepegawaian dan Payroll */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kepegawaian */}
              <div>
                <h2 className="text-xl font-semibold text-[#141414] mb-4">
                  Informasi Kepegawaian
                </h2>
                <div className="grid grid-cols-1 gap-y-2">
                  <FieldRow label="Mulai Kerja" value={karyawan.startDate} />
                  <FieldRow label="Masa Kerja" value={karyawan.tenure || "-"} />
                  <FieldRow
                    label="Akhir Kerja"
                    value={karyawan.endDate || "-"}
                  />
                  <FieldRow label="Jadwal Kerja" value={karyawan.schedule} />
                  <FieldRow
                    label="Tipe Kontrak"
                    value={karyawan.contractType}
                  />
                  <FieldRow label="Jabatan" value={karyawan.position} />
                  <FieldRow label="Cabang" value={karyawan.branch} />
                  <FieldRow label="Status Kerja" value={karyawan.status} />
                </div>
              </div>

              {/* Payroll */}
              <div>
                <h2 className="text-xl font-semibold text-[#141414] mb-4">
                  Payroll
                </h2>
                <div className="grid grid-cols-1 gap-y-2">
                  <FieldRow
                    label="Tanggal Efektif"
                    value={karyawan.effectiveDate}
                  />
                  <FieldRow label="Bank" value={karyawan.bank} />
                  <FieldRow
                    label="Nomer Rekening"
                    value={karyawan.bankAccount}
                  />
                  <FieldRow
                    label="Gaji Pokok"
                    value={formatRupiah(karyawan.basicSalary)}
                  />
                  <FieldRow
                    label="Uang Lembur"
                    value={formatRupiah(karyawan.overtimePay)}
                  />
                  <FieldRow
                    label="Denda Terlambat"
                    value={formatRupiah(karyawan.latePenalty)}
                  />
                  <FieldRow
                    label="Total"
                    value={
                      <span className="font-bold">
                        {formatRupiah(karyawan.totalSalary)}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>


              {/* Dokumen */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-[#141414] mb-4">
                  Dokumen Karyawan
                </h2>

                <div className="space-y-3">
                  {employeeDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="max-w-[480px] w-full p-1 rounded-lg bg-[#7CA5BF]/60"
                    >
                      <div className="flex justify-between items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-[180px]">
                            <a
                              href={`/uploads/${doc.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[18px] text-[#141414] font-normal hover:underline"
                            >
                              {doc.name}
                            </a>
                          </div>
                        </div>
                        <p className="text-[16px] text-[#141414] opacity-60 font-normal">
                          uploaded at -
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <p className="font-normal text-[16px]">{label}</p>
      <p className="font-bold text-[16px]">:</p>
      <p className="font-normal text-[16px]">{value}</p>
    </div>
  );
}
