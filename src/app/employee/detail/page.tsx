"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DetailKaryawan() {
  const router = useRouter();

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
  {/* Foto dan Nama */}
  <div className="flex flex-col items-center justify-start mb-6">
    <div className="w-40 h-40 rectangle-full overflow-hidden mb-2 bg-gray-200">
      <Image
        src="/ahmad.jpg"
        alt="Ahmad"
        width={160}
        height={160}
        className="w-full h-full object-cover"
      />
    </div>
    <p className="font-bold text-lg">Ahmad</p>
    <p className="text-sm text-gray-500">Manager</p>
  </div>

  {/* Informasi Pribadi dan Informasi Kepegawaian */}
  <div className="md:col-span-2 flex flex-col justify-start space-y-4"> 
    {/* Menambahkan space-y-4 agar informasi tidak terlalu rapat */}
    <div>
      <h2 className="text-[24px] font-bold text-[#141414] mb-4">Informasi Pribadi</h2>
      <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
        <FieldRow label="NIK" value="0812 3323232 10231831" />
        <FieldRow label="Alamat" value="Jl. Gunung Merbabu V No.12, Desa Anyaran Kota Nirpajak" />
        <FieldRow label="Tempat, Tgl lahir" value="Bandung, 12 Mei 1991" />
        <FieldRow label="Jenis Kelamin" value="Laki-laki" />
        <FieldRow label="Pendidikan Terakhir" value="S2 - Master in Business Administration" />
        <FieldRow label="Email" value="Ahmad_CC@gmail.com" />
        <FieldRow label="No Telp" value="085850219981" />
      </div>
    </div>

    {/* Informasi Kepegawaian dan Payroll */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-[24px] font-bold text-[#141414] mb-4">Informasi Kepegawaian</h2>
        <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
          <FieldRow label="Mulai Kerja" value="13/03/2020" />
          <FieldRow label="Masa Kerja" value="-" />
          <FieldRow label="Akhir Kerja" value="-" />
          <FieldRow label="Jadwal Kerja" value="Jadwal Kantor" />
          <FieldRow label="Tipe Kontrak" value="Tetap" />
          <FieldRow label="Jabatan" value="Manager" />
          <FieldRow label="Cabang" value="Malang" />
          <FieldRow label="Status Kerja" value="Aktif" />
        </div>
      </div>

      {/* Payroll - Kolom 2 */}
      <div>
        <h2 className="text-[24px] font-bold text-[#141414] mb-4">Payroll</h2>
        <div className="grid grid-cols-[auto_10px_1fr] gap-x-2 gap-y-2 text-[18px] text-[#141414]">
          <FieldRow label="Tanggal Efektif" value="17/05/2025" />
          <FieldRow label="Bank" value="Bank HRIS" />
          <FieldRow label="Nomer Rekening" value="129XXXXXXXXXX" />
          <FieldRow label="Gaji Pokok" value="Rp. 12.000.000" />
          <FieldRow label="Uang Lembur" value="Rp. 220.000" />
          <FieldRow label="Denda Terlambat" value={<span className="text-red-500">Rp. 20.000</span>} />
          <FieldRow label="Total" value={<span className="font-bold">Rp. 12.200.000</span>} />
        </div>
      </div>
    </div>
  </div>

  {/* Dokumen Karyawan - Kolom 1 dan 2, Baris 3 */}
  <div className="md:col-span-3 mt-6">
    <h2 className="text-[24px] font-bold text-[#141414] mb-4">Dokumen Karyawan</h2>
    <div className="bg-gray-100 p-4 rounded-md">
      <p className="font-normal text-[#141414]">
        [Dokumen terkait karyawan seperti KTP, Surat Kontrak Kerja, dan lainnya]
      </p>
    </div>
  </div>
</div>
</div>

  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <p className="font-bold">{label}</p>
      <p className="font-bold">:</p>
      <p className="font-normal">{value}</p>
    </>
  );
}
