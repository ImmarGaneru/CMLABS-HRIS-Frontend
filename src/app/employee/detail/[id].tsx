"use client";

import Image from "next/image";
import { useRouter } from "next/router"; // import router
import { useEffect, useState } from "react";

type Karyawan = {
  id: string;
  name: string;
  photo: string;
  position: string;
  nik: string;
  address: string;
  birthplace: string;
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
  const { id } = router.query; // Ambil id dari query params URL
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return; // Jika id tidak ada, jangan panggil API

    const fetchKaryawan = async () => {
      try {
        const res = await fetch(`/employee/detail/${id}`);
        const data = await res.json();
        if (res.ok) {
          setKaryawan(data as Karyawan);
        } else {
          alert(data.error || "Gagal mengambil detail karyawan.");
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengambil data karyawan.");
      }
    };

    fetchKaryawan();
  }, [id]); // Pastikan hanya dijalankan saat id tersedia

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/list-docs");
        const data = await res.json();
        if (res.ok) {
          setFiles(data.files as string[]);
        } else {
          alert(data.error || "Gagal mengambil dokumen.");
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengambil dokumen.");
      }
    };

    fetchFiles();
  }, []);

  if (!karyawan) return <p>Loading...</p>;

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

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Foto dan Nama */}
        <div className="flex flex-col items-start justify-start mb-6">
          <div className="w-40 h-40 rectangle-full overflow-hidden mb-2 bg-gray-200">
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

        {/* Informasi Pribadi dan Kepegawaian */}
        <div className="md:col-span-2 flex flex-col justify-start space-y-10">
          <div>
            <h2 className="text-[20px] font-bold text-[#141414] mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
              <FieldRow label="NIK" value={karyawan.nik} />
              <FieldRow label="Alamat" value={karyawan.address} />
              <FieldRow label="Tempat, Tgl Lahir" value={`${karyawan.birthplace}, ${karyawan.startDate}`} />
              <FieldRow label="Jenis Kelamin" value={karyawan.gender} />
              <FieldRow label="Pendidikan Terakhir" value={karyawan.education} />
              <FieldRow label="Email" value={karyawan.email} />
              <FieldRow label="No Telp" value={karyawan.phone} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-[20px] font-bold text-[#141414] mb-4">Informasi Kepegawaian</h2>
              <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
                <FieldRow label="Mulai Kerja" value={karyawan.startDate} />
                <FieldRow label="Masa Kerja" value={karyawan.tenure || "-"} />
                <FieldRow label="Akhir Kerja" value={karyawan.endDate || "-"} />
                <FieldRow label="Jadwal Kerja" value={karyawan.schedule} />
                <FieldRow label="Tipe Kontrak" value={karyawan.contractType} />
                <FieldRow label="Jabatan" value={karyawan.position} />
                <FieldRow label="Cabang" value={karyawan.branch} />
                <FieldRow label="Status Kerja" value={karyawan.status} />
              </div>
            </div>

            <div className="pl-6 md:pl-20">
              <h2 className="text-[20px] font-bold text-[#141414] mb-4">Payroll</h2>
              <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
                <FieldRow label="Tanggal Efektif" value={karyawan.effectiveDate} />
                <FieldRow label="Bank" value={karyawan.bank} />
                <FieldRow label="Nomer Rekening" value={karyawan.bankAccount} />
                <FieldRow label="Gaji Pokok" value={formatRupiah(karyawan.basicSalary)} />
                <FieldRow label="Uang Lembur" value={formatRupiah(karyawan.overtimePay)} />
                <FieldRow label="Denda Terlambat" value={formatRupiah(karyawan.latePenalty)} />
                <FieldRow label="Total" value={<span className="font-bold">{formatRupiah(karyawan.totalSalary)}</span>} />
              </div>
            </div>
          </div>

          {/* Dokumen Karyawan */}
          <div className="md:col-span-3 mt-6">
            <h2 className="text-[20px] font-bold text-[#141414] mb-4">Dokumen Karyawan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index} className="bg-blue-100 p-4 rounded-md border border-blue-500">
                    <a
                      href={`/uploads/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file}
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <p>Tidak ada dokumen yang tersedia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <p className="font-normal text-[16px]">{label}</p>
      <p className="font-bold text-[16px]">:</p>
      <p className="font-normal text-[16px]">{value}</p>
    </>
  );
}
