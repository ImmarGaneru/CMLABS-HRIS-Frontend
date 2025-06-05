/* eslint-disable @next/next/no-img-element */
"use client";


import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../../../../../utils/api";
import { FaCamera } from "react-icons/fa";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type Dokumen = {
  id: string;
  name: string;
  url: string;
};

type Karyawan = {
  id: string;
  id_user: string;
  name: string;
  avatar: string | Blob | undefined;
  first_name: string;
  last_name: string;
  jabatan: string;
  nik: string;
  address: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  pendidikan: string;
  email: string;
  notelp: string;
  dokumen: Dokumen[];
  startDate: string;
  tenure: string;
  endDate: string;
  jadwal: string;
  tipeKontrak: string;
  cabang: string;
  employment_status: string;
  tanggalEfektif: string;
  bank: string;
  norek: string;
  gaji: string;
  uangLembur: string;
  dendaTerlambat: string;
  TotalGaji: string;
};

type EditableFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  options?: { value: string; label: string }[];
};

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  options = [],
}: EditableFieldProps) {
  if (type === "select") {
    return (
      <div>
        <label className="block mb-1 font-semibold">{label}</label>
        <select
          className="border border-gray-300 rounded w-full p-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        className="border border-gray-300 rounded w-full p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function EditKaryawan() {
  const router = useRouter();
  const params = useParams() as { id?: string }; // id optional, safer

  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [position, setPositions] = useState<{ id: string; name: string }[]>([]);
  const [, setLoadingPositions] = useState(true);

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);


  // Fetch positions once on mount
  useEffect(() => {
    async function fetchPositions() {
      try {
        const res = await api.get("/position");
        setPositions(res.data.data || []);
      } catch {
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    }
    fetchPositions();
  }, []);
// Fetch employee data saja
useEffect(() => {
  if (!params?.id) return;

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/employee/${params.id}`);
      const rawData = res.data;

      const mappedData: Karyawan = {
        id: rawData.id ?? "",
        name: `${rawData.first_name ?? ""} ${rawData.last_name ?? ""}`.trim(),
        first_name: rawData.first_name ?? "",
        last_name: rawData.last_name ?? "",
        avatar: rawData.avatar
          ? `http://localhost:8000/storage/${rawData.avatar}`
          : "/default.jpg",
        jabatan: rawData.jabatan ?? "",
        nik: rawData.nik ?? "-",
        address: rawData.address ?? "",
        tempatLahir: rawData.tempatLahir ?? "",
        tanggalLahir: rawData.tanggalLahir ?? "",
        jenisKelamin: rawData.jenisKelamin ?? "",
        pendidikan: rawData.pendidikan ?? "",
        email: rawData.email ?? "-",
        notelp: rawData.notelp ?? "",
        dokumen: rawData.dokumen ?? [],
        startDate: rawData.startDate ?? "-",
        tenure: rawData.tenure ?? "-",
        endDate: rawData.endDate ?? "-",
        jadwal: rawData.jadwal ?? "",
        tipeKontrak: rawData.tipeKontrak ?? "",
        cabang: rawData.cabang ?? "",
        employment_status: rawData.employment_status ?? "-",
        tanggalEfektif: rawData.tanggalEfektif ?? "-",
        bank: rawData.bank ?? "",
        norek: rawData.norek ?? "",
        gaji: rawData.gaji ?? "0",
        uangLembur: rawData.uangLembur ?? "0",
        dendaTerlambat: rawData.dendaTerlambat ?? "0",
        TotalGaji: rawData.TotalGaji ?? "0",
        id_user: ""
      };

      setKaryawan(mappedData);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Request failed with status ${err.response?.status}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchEmployee();
}, [params?.id]);

  // Handle avatar upload preview
  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedAvatar(e.target.files[0]);
  //     setKaryawan((prev) =>
  //       prev ? { ...prev, photo: URL.createObjectURL(e.target.files![0]) } : prev
  //     );
  //   }
  // };

  // Submit updated data
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!karyawan) return;

  const { first_name, last_name, nik, email,  id } = karyawan;

  if (!first_name?.trim() || !last_name?.trim() || !nik?.trim() || !email?.trim()) {
    alert("Harap lengkapi nama depan, nama belakang, NIK, dan email.");
    return;
  }

  if (!id) {
    alert("ID karyawan tidak ditemukan.");
    return;
  }

  try {
    const formData = new FormData();
     // Append string fields langsung
  formData.append("first_name", karyawan.first_name);
  formData.append("last_name", karyawan.last_name);
  formData.append("jabatan", karyawan.jabatan);
  formData.append("nik", karyawan.nik);
  formData.append("address", karyawan.address ?? "");
  formData.append("tempatLahir", karyawan.tempatLahir ?? "");
  formData.append("tanggalLahir", karyawan.tanggalLahir ?? "");
  formData.append("jenisKelamin", karyawan.jenisKelamin ?? "");
  formData.append("pendidikan", karyawan.pendidikan ?? "");
  formData.append("email", karyawan.email);
  formData.append("notelp", karyawan.notelp ?? "");
  formData.append("startDate", karyawan.startDate ?? "");
  formData.append("tenure", karyawan.tenure ?? "");
  formData.append("endDate", karyawan.endDate ?? "");
  formData.append("jadwal", karyawan.jadwal ?? "");
  formData.append("tipeKontrak", karyawan.tipeKontrak ?? "");
  formData.append("cabang", karyawan.cabang ?? "");
  formData.append("status", karyawan.employment_status ?? "");
  formData.append("tanggalEfektif", karyawan.tanggalEfektif ?? "");
  formData.append("bank", karyawan.bank ?? "");
  formData.append("norek", karyawan.norek ?? "");
  formData.append("gaji", karyawan.gaji ?? "0");
  formData.append("uangLembur", karyawan.uangLembur ?? "0");
  formData.append("dendaTerlambat", karyawan.dendaTerlambat ?? "0");
  formData.append("TotalGaji", karyawan.TotalGaji ?? "0");
    

    if (selectedAvatar) {
      formData.append("avatar", selectedAvatar);
    }

   // Kirim PUT request tanpa X-HTTP-Method-Override
    await api.put(`/employee/${id}`, formData, {
      headers: {
        // Jangan set content-type, biar axios yang set otomatis multipart/form-data
      },
    });

    toast.success("Data berhasil diperbarui!");
    setTimeout(() => {
      router.push("/employee");
    }, 2000);
  } catch (error: unknown) {
    // Tampilkan error detail di console
    if (axios.isAxiosError(error)) {
      console.error("Response error data:", error.response?.data);
      toast.error(`Gagal memperbarui data: ${JSON.stringify(error.response?.data)}`);
    } else {
      console.error(error);
      toast.error("Gagal memperbarui data.");
    }
  }
};
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!karyawan) return <div className="p-4">Data karyawan tidak ditemukan.</div>;

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
      <form onSubmit={handleSubmit} className="space-y-8">
   <ToastContainer />
   

<div className="flex flex-col items-start space-y-4">
  <div className="flex items-center gap-6">
    {/* Kotak foto dengan border, bayangan dan rounded */}
    <div className="w-40 h-52 rounded-lg bg-gray-100 overflow-hidden shadow-md border border-gray-300 hover:border-blue-500 transition-all duration-300">
      <img
        src={
          selectedAvatar
            ? URL.createObjectURL(selectedAvatar)
            : karyawan.avatar || "/default.jpg"
        }
        alt={karyawan.name || "Avatar"}
        width={200}
        height={200}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Tombol upload file custom */}
    <label
      htmlFor="avatarUpload"
      className="cursor-pointer flex flex-col items-center justify-center px-4 py-3 bg-[#1E3A5F]  text-white rounded-md shadow-md hover:bg-[#155A8A]  transition-colors duration-300"
      
      title="Upload Foto Avatar"
    >
      <FaCamera className="mb-2 text-lg" />
      <span className="text-sm font-semibold">Ubah Foto</span>
      <input
        id="avatarUpload"
        type="file"
        
        accept="image/*"
        
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedAvatar(e.target.files[0]);
            setKaryawan({ ...karyawan, avatar: e.target.files[0] });
          }
        }}
      />
    </label>
  </div>

  {/* Optional: Tampilkan nama file yang dipilih */}
  {selectedAvatar && (
    <p className="text-gray-600 italic text-sm">File terpilih: {selectedAvatar.name}</p>
  )}
</div>


        {/* Bagian Informasi Pribadi */}
        <div>
          <h2 className="text-xl font-bold text-[#141414] mb-4">
            Informasi Pribadi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EditableField
              label="Nama Depan"
              value={karyawan.first_name}
              onChange={(v) => setKaryawan({ ...karyawan, first_name: v })}
            />
            <EditableField
              label="Nama Belakang"
              value={karyawan.last_name}
              onChange={(v) => setKaryawan({ ...karyawan, last_name: v })}
            />
            <EditableField
              label="NIK"
              type="number"
              value={karyawan.nik}
              onChange={(v) => setKaryawan({ ...karyawan, nik: v })}
            />
            <EditableField
              label="Alamat"
              value={karyawan.address}
              onChange={(v) => setKaryawan({ ...karyawan, address: v })}
            />
            <EditableField
              label="Tempat Lahir"
              value={karyawan.tempatLahir}
              onChange={(v) => setKaryawan({ ...karyawan, tempatLahir: v })}
            />
            <EditableField
              label="Tanggal Lahir"
              type="date"
              value={karyawan.tanggalLahir}
              onChange={(v) => setKaryawan({ ...karyawan, tanggalLahir: v })}
            />
            <EditableField
              label="Jenis Kelamin"
              type="select"
              value={karyawan.jenisKelamin || ""} // fallback jika null/undefined
              onChange={(v) => setKaryawan({ ...karyawan, jenisKelamin: v })}
              options={[
                { value: "", label: "-Select Gender-" },
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ]}
            />

            <EditableField
              label="Pendidikan Terakhir"
              type="select"
              value={karyawan.pendidikan || ""}
              onChange={(v) => setKaryawan({ ...karyawan, pendidikan: v })}
              options={[
                { value: "", label: "-Select Education-" },
                { value: "SMA/SMK", label: "SMA/SMK" },
                { value: "D3", label: "D3" },
                { value: "S1", label: "S1" },
                { value: "S2", label: "S2" },
                { value: "S3", label: "S3" },
              ]}
            />

            <EditableField
              label="Email"
              type="email"
              value={karyawan.email}
              onChange={(v) => setKaryawan({ ...karyawan, email: v })}
            />
            <EditableField
              label="No Telp"
              value={karyawan.notelp}
              onChange={(v) => setKaryawan({ ...karyawan, notelp: v })}
            />
          </div>
        </div>

        {/* Bagian Informasi Kepegawaian & Payroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">
              Informasi Kepegawaian
            </h2>
            <div className="space-y-4">
              <EditableField
                label="Mulai Kerja"
                type="date"
                value={karyawan.startDate}
                onChange={(v) => setKaryawan({ ...karyawan, startDate: v })}
              />
              <EditableField
                label="Akhir Kerja"
                type="date"
                value={karyawan.endDate}
                onChange={(v) => setKaryawan({ ...karyawan, endDate: v })}
              />
              <EditableField
                label="Jadwal Kerja"
                   type="select"
                value={karyawan.jadwal || ""}
                onChange={(v) => setKaryawan({ ...karyawan, jadwal: v })}
                 options={[
                { value: "", label: "-Select Jadwal-" },
                { value: "Shift", label: "Shift" },
                { value: "Non-Shift", label: "Non-Shift" },
              ]}
              />
              <EditableField
                label="Tipe Kontrak"
                type="select"
                value={karyawan.tipeKontrak}
                onChange={(v) => setKaryawan({ ...karyawan, tipeKontrak: v })}
                options={[
                  { value: "Tetap", label: "Tetap" },
                  { value: "Kontrak", label: "Kontrak" },
                  {value: "Magang", label: "Magang"},
                ]}
              />
              <EditableField
                label="Jabatan"
                type="select"
                value={karyawan.jabatan || ""}
                onChange={(v) => setKaryawan({ ...karyawan, jabatan: v })}
                options={position.map((pos) => ({
                  value: pos.name,
                  label: pos.name,
                }))}
              />

              <EditableField
                label="Cabang"
                value={karyawan.cabang}
                onChange={(v) => setKaryawan({ ...karyawan, cabang: v })}
              />
              <EditableField
                label="Status Kerja"
                type="select"
                value={karyawan.employment_status}
                onChange={(v) => setKaryawan({ ...karyawan, employment_status: v })}
                options={[
                  { value: "Aktif", label: "Aktif" },
                  { value: "Non-Aktif", label: "Non-Aktif" },
                ]}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">
              Payroll
            </h2>
            <div className="space-y-4">
              <EditableField
                label="Tanggal Efektif"
                type="date"
                value={karyawan.tanggalEfektif}
                onChange={(v) => setKaryawan({ ...karyawan, tanggalEfektif: v })}
              />
              <EditableField
                label="Bank"
                value={karyawan.bank}
                onChange={(v) => setKaryawan({ ...karyawan, bank: v })}
              />
              <EditableField
                label="Nomer Rekening"
                type="number"
                value={karyawan.norek}
                onChange={(v) => setKaryawan({ ...karyawan, norek: v })}
              />
              <EditableField
                label="Gaji Pokok"
                type="number"
                value={karyawan.gaji}
                onChange={(v) => setKaryawan({ ...karyawan, gaji: v })}
              />
              <EditableField
                label="Uang Lembur"
                type="number"
                value={karyawan.uangLembur}
                onChange={(v) => setKaryawan({ ...karyawan, uangLembur: v })}
              />
              <EditableField
                label="Denda Terlambat"
                type="number"
                value={karyawan.dendaTerlambat}
                onChange={(v) => setKaryawan({ ...karyawan, dendaTerlambat: v })}
              />
              <EditableField
                label="Total Gaji"
                type="number"
                value={karyawan.TotalGaji}
                onChange={(v) => setKaryawan({ ...karyawan, TotalGaji: v })}
              />
            </div>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-[#1E3A5F] text-white px-6 py-2 rounded-md hover:bg-[#155A8A] transition duration-200"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}



