"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getEmployee } from "../../../../../utils/employee"; // import fungsi fetch

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

export default function DetailKaryawan({ id }: { id: string }) {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID karyawan tidak tersedia");
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getEmployee(id);
        setKaryawan(data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data karyawan");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const formatRupiah = (value: string | number | undefined) =>
    value ? `Rp ${Number(value).toLocaleString("id-ID")}` : "-";

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!karyawan) return <div className="p-6">Tidak ada data karyawan</div>;


  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!karyawan) return <div className="p-6">Data karyawan tidak ditemukan.</div>;

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

      <div className="flex flex-col md:flex-row gap-20 items-start">
        {/* Foto dan Identitas */}
        <div className="flex flex-col items-start mb-6">
          <div className="w-40 h-40 overflow-hidden mb-3 bg-gray-200 rounded-full">
            <Image
              src={karyawan.photo || "/default.jpg"}
              alt={karyawan.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-lg">{karyawan.name}</p>
          <p className="text-sm text-gray-500">{karyawan.position}</p>
        </div>

        {/* Detail Info */}
        <div className="flex-1 flex flex-col gap-y-10">
          <Section title="Informasi Pribadi">
            <FieldRow label="NIK" value={karyawan.nik} />
            <FieldRow label="Alamat" value={karyawan.address} />
            <FieldRow
              label="Tempat, Tgl Lahir"
              value={`${karyawan.birthplace}, ${karyawan.birthdate}`}
            />
            <FieldRow label="Jenis Kelamin" value={karyawan.gender} />
            <FieldRow label="Pendidikan Terakhir" value={karyawan.education} />
            <FieldRow label="Email" value={karyawan.email} />
            <FieldRow label="No Telp" value={karyawan.phone} />
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Informasi Kepegawaian">
              <FieldRow label="Mulai Kerja" value={karyawan.startDate} />
              <FieldRow label="Masa Kerja" value={karyawan.tenure || "-"} />
              <FieldRow label="Akhir Kerja" value={karyawan.endDate} />
              <FieldRow label="Jadwal Kerja" value={karyawan.schedule} />
              <FieldRow label="Tipe Kontrak" value={karyawan.contractType} />
              <FieldRow label="Jabatan" value={karyawan.position} />
              <FieldRow label="Cabang" value={karyawan.branch} />
              <FieldRow label="Status Kerja" value={karyawan.status} />
            </Section>

            <Section title="Payroll">
              <FieldRow label="Tanggal Efektif" value={karyawan.effectiveDate} />
              <FieldRow label="Bank" value={karyawan.bank} />
              <FieldRow label="Nomer Rekening" value={karyawan.bankAccount} />
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
            </Section>
          </div>

          <Section title="Dokumen Karyawan">
            <div className="space-y-3">
              {employeeDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="max-w-[480px] w-full p-2 rounded-lg bg-[#7CA5BF]/60"
                >
                  <div className="flex justify-between items-center">
                    <a
                      href={`/uploads/${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[18px] text-[#141414] font-medium hover:underline"
                    >
                      {doc.name}
                    </a>
                    <p className="text-[14px] text-[#141414] opacity-60 font-normal">
                      uploaded at -
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex text-[16px]">
      <div className="w-48 font-normal">{label}</div>
      <div className="font-bold">:</div>
      <div className="ml-2">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#141414] mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {children}
      </div>
    </div>
  );
}
