/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../../../../../utils/api";
import { FaCamera, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPositions } from "../../../../../utils/position";

type Dokumen = {
  file: string | URL | undefined;
  id: string;
  name: string;
  url: string;
};
function parseRupiahToNumber(rupiahStr: string | null | undefined): number {
  if (!rupiahStr) return 0;

  // Hapus "Rp", spasi, dan titik ribuan
  const numberStr = rupiahStr.replace(/[^0-9,-]+/g, "").replace(/,/g, "");
  // Contoh: "Rp 6.500.000" -> "6500000"

  return Number(numberStr) || 0;
}
type Karyawan = {
  id: string;
  id_user: string;
  id_position: string;
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
  disabled?: boolean; // <- tambahkan ini
  readOnly?: boolean; // <- bisa juga tambahkan ini kalau mau support readOnly
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
          <option value="">-- Pilih {label} --</option>{" "}
          {/* ✅ Tambahan penting */}
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

  const [positions, setPositions] = useState<
    { id: string; name: string; gaji: number }[]
  >([]);

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    id_user: "",
    avatar: null as File | null,
    first_name: "",
    last_name: "",
    nik: "",
    address: "",
    notelp: "",
    email: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    pendidikan: "",
    jadwal: "",
    tipeKontrak: "Tetap",
    grade: "",
    jabatan: "",
    id_position: "", // id dari posisi yang dipilih

    cabang: "",
    bank: "",
    norek: "",
    startDate: "",
    endDate: "",
    tenure: "",
    tanggalEfektif: "",
    gaji: 0,
    uangLembur: 0,
    dendaTerlambat: 0,
    TotalGaji: 0,
    dokumen: null as File | null,
    employment_status: "",
  });

  interface PositionResponse {
    id: string | number;
    name: string;
    gaji?: number | null;
    uangLembur?: number | null;
    dendaTerlambat?: number | null;
    TotalGaji?: number | null;
  }

  // Fetch positions once on mount
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await getPositions();
        const mapped = response.data.map((pos: PositionResponse) => ({
          id: pos.id.toString(),
          name: pos.name,
          gaji: pos.gaji ?? 0,
          uangLembur: pos.uangLembur ?? 0,
          dendaTerlambat: pos.dendaTerlambat ?? 0,
          TotalGaji: pos.TotalGaji ?? 0,
        }));
        setPositions(mapped);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    }
    fetchPositions();
  }, []);

  const handleDeleteDocument = async (docId: string) => {
    if (!karyawan?.id_user) {
      alert("ID user tidak ditemukan.");
      return;
    }

    const confirmDelete = confirm("Yakin ingin menghapus dokumen ini?");
    if (!confirmDelete) return;

    try {
      console.log(
        `Menghapus dokumen di URL: /user/${karyawan.id_user}/document/${docId}`
      );

      await api.delete(`/user/${karyawan.id_user}/document/${docId}`);

      const updatedDokumen = karyawan.dokumen?.filter(
        (doc) => doc.id !== docId
      );
      setKaryawan((prev) =>
        prev ? { ...prev, dokumen: updatedDokumen } : prev
      );

      toast.success("Dokumen berhasil dihapus.");
    } catch (error) {
      toast.error("Gagal menghapus dokumen.");
      console.error("Delete document error:", error);
    }
  };

  // Fetch employee data saja
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mapRawToKaryawan(rawData: any): Karyawan {
    const gajiNum = parseRupiahToNumber(rawData.gaji);
    const lemburNum = parseRupiahToNumber(rawData.uangLembur);
    const dendaNum = parseRupiahToNumber(rawData.dendaTerlambat);
    const totalNum = gajiNum + lemburNum - dendaNum;

    return {
      id: rawData.id ?? "",
      id_user: rawData.id_user ?? "",
      id_position: rawData.id_position ?? "",
      first_name: rawData.first_name ?? "",
      last_name: rawData.last_name ?? "",
      name: `${rawData.first_name ?? ""} ${rawData.last_name ?? ""}`.trim(),
      avatar: rawData.avatar || "/default.jpg",
      jabatan: rawData.jabatan ?? "",
      nik: rawData.nik ?? "",
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
      gaji: gajiNum.toString(),
      uangLembur: lemburNum.toString(),
      dendaTerlambat: dendaNum.toString(),
      TotalGaji: totalNum.toString(),
    };
  }
  useEffect(() => {
    if (!params?.id) return;

    async function fetchEmployee() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`employee/${params.id}`);
        const mappedData = mapRawToKaryawan(res.data.data);
        setKaryawan(mappedData);

        // Update formData dari mappedData:
        setFormData({
          id: mappedData.id,
          id_user: mappedData.id_user,
          avatar: null,
          first_name: mappedData.first_name,
          last_name: mappedData.last_name,
          nik: mappedData.nik,
          address: mappedData.address,
          notelp: mappedData.notelp,
          email: mappedData.email,
          tempatLahir: mappedData.tempatLahir,
          tanggalLahir: mappedData.tanggalLahir,
          jenisKelamin: mappedData.jenisKelamin,
          pendidikan: mappedData.pendidikan,
          jadwal: mappedData.jadwal,
          tipeKontrak: mappedData.tipeKontrak,
          grade: "", // jika tidak ada di mappedData, bisa kosong
          jabatan: mappedData.jabatan,
          id_position: mappedData.id_position,

          cabang: mappedData.cabang,
          bank: mappedData.bank,
          norek: mappedData.norek,
          startDate: mappedData.startDate,
          endDate: mappedData.endDate,
          tenure: mappedData.tenure,
          tanggalEfektif: mappedData.tanggalEfektif,
          gaji: Number(mappedData.gaji),
          uangLembur: Number(mappedData.uangLembur),
          dendaTerlambat: Number(mappedData.dendaTerlambat),
          TotalGaji: Number(mappedData.TotalGaji),
          dokumen: null,
          employment_status: mappedData.employment_status,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message ?? "Error API");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Terjadi kesalahan tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [params?.id]);

  const handleJabatanChange = (selectedId: string) => {
    const selectedPosition = positions.find(
      (pos) => pos.id.toString() === selectedId
    );

    if (!selectedPosition) {
      console.warn("Jabatan tidak ditemukan:", selectedId);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      id_position: selectedId,
      jabatan: selectedPosition.name,
      gaji: selectedPosition.gaji,
      TotalGaji: selectedPosition.gaji + prev.uangLembur - prev.dendaTerlambat,
    }));
  };
  useEffect(() => {
    const total =
      (Number(formData.gaji) || 0) +
      (Number(formData.uangLembur) || 0) -
      (Number(formData.dendaTerlambat) || 0);

    setFormData((prev) => ({
      ...prev,
      TotalGaji: total,
    }));
  }, [formData.gaji, formData.uangLembur, formData.dendaTerlambat]);

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

  const [dokumenFiles] = React.useState<File[]>([]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const id = params?.id;
  if (!id) {
    toast.error("ID karyawan tidak ditemukan.");
    return;
  }

  const tanggalEfektifForApi = formData.tanggalEfektif;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalEfektifForApi)) {
    alert("Format tanggalEfektif salah!");
    return;
  }

  const validStatuses = ["active", "inactive", "resign"];
  if (!validStatuses.includes(formData.employment_status)) {
    toast.error(
      `Status kerja tidak valid. Harus salah satu dari: ${validStatuses.join(", ")}`
    );
    return;
  }

  try {
    const dataToSend = new FormData();

    // Append data biasa
    dataToSend.append("first_name", formData.first_name);
    dataToSend.append("last_name", formData.last_name);
    dataToSend.append("jabatan", formData.jabatan || "");
    dataToSend.append("id_position", formData.id_position || "");
    dataToSend.append("nik", formData.nik);
    dataToSend.append("address", formData.address || "");
    dataToSend.append("tempatLahir", formData.tempatLahir || "");
    dataToSend.append("tanggalLahir", formData.tanggalLahir || "");
    dataToSend.append("jenisKelamin", formData.jenisKelamin || "");
    dataToSend.append("pendidikan", formData.pendidikan || "");
    dataToSend.append("email", formData.email);
    dataToSend.append("notelp", formData.notelp || "");
    dataToSend.append("startDate", formData.startDate || "");
    dataToSend.append("tenure", formData.tenure || "");
    dataToSend.append("endDate", formData.endDate || "");
    dataToSend.append("jadwal", formData.jadwal || "");
    dataToSend.append("tipeKontrak", formData.tipeKontrak || "");
    dataToSend.append("cabang", formData.cabang || "");
    dataToSend.append("employment_status", formData.employment_status || "");
    dataToSend.append("tanggalEfektif", tanggalEfektifForApi);
    dataToSend.append("bank", formData.bank || "");
    dataToSend.append("norek", formData.norek || "");
    dataToSend.append("gaji", formData.gaji?.toString() || "0");
    dataToSend.append("uangLembur", formData.uangLembur?.toString() || "0");
    dataToSend.append("dendaTerlambat", formData.dendaTerlambat?.toString() || "0");
    dataToSend.append("TotalGaji", formData.TotalGaji?.toString() || "0");

    // Avatar tunggal
    if (selectedAvatar) {
      dataToSend.append("avatar", selectedAvatar);
    }

    // Dokumen array
    if (dokumenFiles && dokumenFiles.length > 0) {
      dokumenFiles.forEach((file) => {
        dataToSend.append("dokumen[]", file);
      });
    }

    // Debug log
    console.log("Mengirim ke:", `/employee/${id}`);
    for (const pair of dataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Kirim data
    const response = await api.put(`/employee/${id}`, dataToSend);
    console.log("Response dari server:", response.data);

    toast.success("Data berhasil diperbarui!");
    setTimeout(() => {
      router.push("/employee");
    }, 1500);

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Response error data:", error.response?.data);
      toast.error(
        `Gagal memperbarui data: ${
          error.response?.data?.message || "Terjadi kesalahan."
        }`
      );
    } else {
      console.error(error);
      toast.error("Gagal memperbarui data.");
    }
  }
};


  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!karyawan)
    return <div className="p-4">Data karyawan tidak ditemukan.</div>;

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
                    setKaryawan((prev) =>
                      prev
                        ? {
                            ...prev,
                            avatar: URL.createObjectURL(e.target.files![0]),
                          }
                        : prev
                    );
                  }
                }}
              />
            </label>
          </div>

          {/* Optional: Tampilkan nama file yang dipilih */}
          {selectedAvatar && (
            <p className="text-gray-600 italic text-sm">
              File terpilih: {selectedAvatar.name}
            </p>
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
              value={formData.first_name}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, first_name: v }))
              }
            />
            <EditableField
              label="Nama Belakang"
              value={formData.last_name}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, last_name: v }))
              }
            />
            <EditableField
              label="NIK"
              type="number"
              value={formData.nik}
              onChange={(v) => setFormData((prev) => ({ ...prev, nik: v }))}
            />
            <EditableField
              label="Alamat"
              value={formData.address}
              onChange={(v) => setFormData((prev) => ({ ...prev, address: v }))}
            />
            <EditableField
              label="Tempat Lahir"
              value={formData.tempatLahir}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, tempatLahir: v }))
              }
            />
            <EditableField
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, tanggalLahir: v }))
              }
            />
            <EditableField
              label="Jenis Kelamin"
              type="select"
              value={formData.jenisKelamin || ""}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, jenisKelamin: v }))
              }
              options={[
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ]}
            />
            <EditableField
              label="Pendidikan Terakhir"
              type="select"
              value={formData.pendidikan || ""}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, pendidikan: v }))
              }
              options={[
                { value: "SMA/SMK", label: "SMA/SMK" },
                { value: "D3", label: "D3" },
                { value: "S1", label: "S1" },
                { value: "S2", label: "S2" },
                { value: "S3", label: "S3" },
              ]}
            />
            <EditableField
              label="Email"
              type="text"
              value={formData.email}
              onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
            />
            <EditableField
              label="No Telp"
              value={formData.notelp}
              onChange={(v) => setFormData((prev) => ({ ...prev, notelp: v }))}
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
                value={formData.startDate}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, startDate: v }))
                }
              />
              <EditableField
                label="Akhir Kerja"
                type="date"
                value={formData.endDate}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, endDate: v }))
                }
              />
              <EditableField
                label="Jadwal Kerja"
                type="select"
                value={formData.jadwal || ""}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, jadwal: v }))
                }
                options={[
                  { value: "", label: "-Select Jadwal-" },
                  { value: "Shift", label: "Shift" },
                  { value: "Non-Shift", label: "Non-Shift" },
                ]}
              />
              <EditableField
                label="Tipe Kontrak"
                type="select"
                value={formData.tipeKontrak}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, tipeKontrak: v }))
                }
                options={[
                  { value: "Tetap", label: "Tetap" },
                  { value: "Kontrak", label: "Kontrak" },
                  { value: "Magang", label: "Magang" },
                ]}
              />
              <EditableField
                label="Jabatan"
                type="select"
                value={formData.id_position || ""}
                onChange={(v) => handleJabatanChange(v)}
                options={positions.map((pos) => ({
                  value: pos.id,
                  label: pos.name,
                }))}
              />
              <EditableField
                label="Cabang"
                value={formData.cabang}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, cabang: v }))
                }
              />
              <EditableField
                label="Status Kerja"
                type="select"
                value={formData.employment_status}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, employment_status: v }))
                }
                options={[
                  { value: "active", label: "active" },
                  { value: "inactive", label: "inactive" },
                  { value: "resign", label: "resign" },
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
                value={formData.tanggalEfektif}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, tanggalEfektif: v }))
                }
              />
              <EditableField
                label="Bank"
                value={formData.bank}
                onChange={(v) => setFormData((prev) => ({ ...prev, bank: v }))}
              />
              <EditableField
                label="Nomer Rekening"
                type="number"
                value={formData.norek}
                onChange={(v) => setFormData((prev) => ({ ...prev, norek: v }))}
              />
              <EditableField
                label="Gaji Pokok"
                type="number"
                value={formData.gaji.toString()}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, gaji: Number(v) }))
                }
              />
              <EditableField
                label="Uang Lembur"
                type="number"
                value={formData.uangLembur.toString()}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, uangLembur: Number(v) }))
                }
              />
              <EditableField
                label="Denda Terlambat"
                type="number"
                value={formData.dendaTerlambat.toString()}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    dendaTerlambat: Number(v),
                  }))
                }
              />
              <EditableField
                label="Total Gaji"
                type="number"
                value={formData.TotalGaji.toString()}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, TotalGaji: Number(v) }))
                }
                readOnly
              />
            </div>
          </div>
        </div>

<div className="relative mb-24">
  <div className="w-full mt-10">
    <h2 className="text-2xl font-semibold text-[#1e293b] mb-4 border-b pb-2">
      📂 Dokumen Karyawan
    </h2>

    {karyawan.dokumen && karyawan.dokumen.length > 0 ? (
      <div className="w-full overflow-x-auto rounded-lg shadow-md mb-6">
        <table className="min-w-[640px] w-full text-left text-sm text-gray-700 border border-gray-300">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 border-r border-gray-300">Nama Dokumen</th>
              {/* <th className="px-6 py-3 border-r border-gray-300">Tanggal Upload</th> */}
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawan.dokumen.map((doc, index) => (
              <tr
                key={index}
                className={`border-b border-gray-300 hover:bg-blue-50 transition duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 border-r border-gray-200 font-medium">
                  {doc.name}
                </td>
                {/* <td className="px-6 py-4 border-r border-gray-200">
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
                    {doc.uploaded_at
                      ? new Date(doc.uploaded_at).toLocaleDateString("id-ID")
                      : "-"}
                  </span>
                </td> */}
                <td className="px-6 py-4 text-center space-x-3">
                  <div className="inline-flex space-x-2 items-center">
                    <button
                      title="Detail"
                      onClick={() => window.open(doc.file, "_blank", "noopener,noreferrer")}
                      className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8] cursor-pointer"
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(doc.id)}
                      title="Hapus"
                      className="border border-red-600 px-3 py-1 rounded text-red-600 bg-[#f8f8f8] hover:bg-red-100"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-sm text-gray-600 italic">Tidak ada dokumen</p>
    )}
  </div>

  <div className="flex justify-end gap-4 mt-6">
    <button
      type="button"
      className="text-blue-500 cursor-pointer hover:text-blue-700"
      onClick={() => (window.location.href = "/employee")}
    >
      Batal
    </button>
    <button
      type="submit"
      className="bg-[#1E3A5F] text-white px-6 py-2 rounded hover:bg-[#155A8A]"
    >
      Simpan
    </button>
  </div>
</div>

      </form>
    </div>
  );
}
