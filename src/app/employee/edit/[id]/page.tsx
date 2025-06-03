"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { use } from "react";

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

export default function EditKaryawan() {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [, setEmployees] = useState<Karyawan[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/employee", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setEmployees(data.data);
        setKaryawan(data.data[0]); // sementara ambil yang pertama
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    alert('Data updated successfully!');
    router.push('/employee');
  };

  if (!karyawan) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded shadow w-full mt-2 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#141414]">Edit Karyawan</h1>
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

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-20 items-start">
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
          <input
            type="text"
            value={karyawan.name}
            onChange={(e) => setKaryawan({ ...karyawan, name: e.target.value })}
            className="font-bold text-lg border rounded px-2 py-1"
          />
          <input
            type="text"
            value={karyawan.position}
            onChange={(e) => setKaryawan({ ...karyawan, position: e.target.value })}
            className="text-sm text-gray-500 border rounded px-2 py-1"
          />
        </div>

        {/* Info Detail */}
        <div className="flex-1 flex flex-col gap-y-10">
          {/* Informasi Pribadi */}
          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <EditableField
                label="NIK"
                value={karyawan.nik}
                onChange={(value) => setKaryawan({ ...karyawan, nik: value })}
              />
              <EditableField
                label="Alamat"
                value={karyawan.address}
                onChange={(value) => setKaryawan({ ...karyawan, address: value })}
              />
              <EditableField
                label="Tempat Lahir"
                value={karyawan.birthplace}
                onChange={(value) => setKaryawan({ ...karyawan, birthplace: value })}
              />
              <EditableField
                label="Tanggal Lahir"
                type="date"
                value={karyawan.birthdate}
                onChange={(value) => setKaryawan({ ...karyawan, birthdate: value })}
              />
              <EditableField
                label="Jenis Kelamin"
                value={karyawan.gender}
                onChange={(value) => setKaryawan({ ...karyawan, gender: value })}
              />
              <EditableField
                label="Pendidikan Terakhir"
                value={karyawan.education}
                onChange={(value) => setKaryawan({ ...karyawan, education: value })}
              />
              <EditableField
                label="Email"
                type="email"
                value={karyawan.email}
                onChange={(value) => setKaryawan({ ...karyawan, email: value })}
              />
              <EditableField
                label="No Telp"
                value={karyawan.phone}
                onChange={(value) => setKaryawan({ ...karyawan, phone: value })}
              />
            </div>
          </div>

          {/* Informasi Kepegawaian dan Payroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kepegawaian */}
            <div>
              <h2 className="text-xl font-semibold text-[#141414] mb-4">
                Informasi Kepegawaian
              </h2>
              <div className="grid grid-cols-1 gap-y-4">
                <EditableField
                  label="Mulai Kerja"
                  type="date"
                  value={karyawan.startDate}
                  onChange={(value) => setKaryawan({ ...karyawan, startDate: value })}
                />
                <EditableField
                  label="Jadwal Kerja"
                  value={karyawan.schedule}
                  onChange={(value) => setKaryawan({ ...karyawan, schedule: value })}
                />
                <EditableField
                  label="Tipe Kontrak"
                  value={karyawan.contractType}
                  onChange={(value) => setKaryawan({ ...karyawan, contractType: value })}
                />
                <EditableField
                  label="Cabang"
                  value={karyawan.branch}
                  onChange={(value) => setKaryawan({ ...karyawan, branch: value })}
                />
                <EditableField
                  label="Status Kerja"
                  value={karyawan.status}
                  onChange={(value) => setKaryawan({ ...karyawan, status: value })}
                />
              </div>
            </div>

            {/* Payroll */}
            <div>
              <h2 className="text-xl font-semibold text-[#141414] mb-4">
                Payroll
              </h2>
              <div className="grid grid-cols-1 gap-y-4">
                <EditableField
                  label="Tanggal Efektif"
                  type="date"
                  value={karyawan.effectiveDate}
                  onChange={(value) => setKaryawan({ ...karyawan, effectiveDate: value })}
                />
                <EditableField
                  label="Bank"
                  value={karyawan.bank}
                  onChange={(value) => setKaryawan({ ...karyawan, bank: value })}
                />
                <EditableField
                  label="Nomer Rekening"
                  value={karyawan.bankAccount}
                  onChange={(value) => setKaryawan({ ...karyawan, bankAccount: value })}
                />
                <EditableField
                  label="Gaji Pokok"
                  type="number"
                  value={karyawan.basicSalary}
                  onChange={(value) => setKaryawan({ ...karyawan, basicSalary: value })}
                />
                <EditableField
                  label="Uang Lembur"
                  type="number"
                  value={karyawan.overtimePay}
                  onChange={(value) => setKaryawan({ ...karyawan, overtimePay: value })}
                />
                <EditableField
                  label="Denda Terlambat"
                  type="number"
                  value={karyawan.latePenalty}
                  onChange={(value) => setKaryawan({ ...karyawan, latePenalty: value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-[#1E3A5F] text-white px-6 py-2 rounded-md hover:bg-[#155A8A] transition duration-200"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <label className="font-normal text-[16px] min-w-[150px]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-normal text-[16px] border rounded px-2 py-1 flex-1"
      />
    </div>
  );
} 