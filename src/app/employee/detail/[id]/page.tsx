/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEmployee } from "../../../../../utils/employee";
import { FaEye } from "react-icons/fa";
import React from "react";
// import { api } from "@/lib/axios";
// import axios from "axios";
// import { DataTable } from "@/components/Datatable";
// import DataTableHeader from "@/components/DatatableHeader";
import api from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseISO, intervalToDuration } from "date-fns";
type Dokumen = {
  id: number;
  name: string;
  file: string;
  uploaded_at?: string;
};

type Karyawan = {
  id: string;
  name: string;
  avatar: string;
  first_name: string;
  last_name: string;
  jabatan: string;
  nik: string;
  id_position: string;
  id_department: string;
  department: string;
  address: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  pendidikan: string;
  email: string;

  dokumen: Dokumen[];
  start_date: string;
  tenure: string;
  end_date: string;
  jadwal: string;
  tipe_kontrak: string;
  cabang: string;
  employment_status: string;
  tanggal_efektif: string;
  bank: string;
  no_rek: string;
  gaji: string;
  uang_lembur: string;
  denda_terlambat: string;
  total_gaji: string;

  // tambahan
  user?: { email: string; phone_number: string };
  position?: { name: string; gaji?: string };
  phone_number: string;
};

export default function DetailKaryawan() {
  const router = useRouter();
  const params = useParams();
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  function calculateTenure(start: string, end?: string): string {
    if (!start || start === "-") return "-";

    try {
      const startDate = parseISO(start);
      const endDate = end && end !== "-" ? parseISO(end) : new Date();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.log("Tanggal tidak valid:", start, end);
        return "-";
      }

      const duration = intervalToDuration({ start: startDate, end: endDate });

      const parts: string[] = [];
      if (duration.years) parts.push(`${duration.years} tahun`);
      if (duration.months) parts.push(`${duration.months} bulan`);
      if (duration.days) parts.push(`${duration.days} hari`);

      return parts.length > 0 ? parts.join(" ") : "0 hari";
    } catch (error) {
      console.log("Error menghitung tenure:", error);
      return "-";
    }
  }

  function parseRupiahToNumber(rupiahStr: string | null | undefined): number {
    if (!rupiahStr) return 0;
    const numberStr = rupiahStr.replace(/[^0-9,-]+/g, "").replace(/,/g, "");
    return Number(numberStr) || 0;
  }

  const formatRupiah = (value: string | number | undefined) => {
    if (!value) return "-";
    const numericValue =
      typeof value === "string" ? Number(value.replace(/[^\d.-]/g, "")) : value;

    return isNaN(numericValue)
      ? "-"
      : `Rp ${numericValue.toLocaleString("id-ID")}`;
  };
  console.log("ID dari params:", params?.id);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setError("ID karyawan tidak tersedia");
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/admin/employees/${id}`);
        const rawData = response.data.data;
        console.log("RAW DATA:", rawData);

        // Cek apakah data yang dibutuhkan tersedia
        if (!rawData) {
          throw new Error("Data karyawan tidak ditemukan.");
        }
        // Ambil nama posisi berdasarkan id_position
        let positionName = rawData.jabatan || "-";
        if (rawData.id_position) {
          try {
            const positionRes = await api.get(
              `/admin/positions/get/${rawData.id_position}`
            );
            if (
              positionRes.data?.meta?.success &&
              positionRes.data?.data?.name
            ) {
              positionName = positionRes.data.data.name;
            }
          } catch (err) {
            console.error("Gagal mengambil data posisi:", err);
            // Biarkan positionName tetap "-"
          }
        }
       
    // Ambil nama departemen berdasarkan id_department
let departemenName = rawData.department || "-";

if (rawData.id_department && !rawData.department) {
  try {
    const departmentRes = await api.get(
      `/admin/departments/get/${rawData.id_department}`
    );
    if (
      departmentRes.data?.meta?.success &&
      departmentRes.data?.data?.name
    ) {
      departemenName = departmentRes.data.data.name;
    }
  } catch (err) {
    console.error("Gagal mengambil data department:", err);
  }
}

// Simpan hasil ke objek
const karyawan = {
  ...rawData,
  id_department: rawData.id_department || "-",
  department: departemenName,
};


        // Pastikan parseRupiahToNumber tidak error
        const gajiNum = parseRupiahToNumber(rawData.gaji || "Rp 0");
        const lemburNum = parseRupiahToNumber(rawData.uang_lembur || "Rp 0");
        const dendaNum = parseRupiahToNumber(rawData.denda_terlambat || "Rp 0");
        const totalNum = gajiNum + lemburNum - dendaNum;

        const mappedData: Karyawan = {
          id: rawData.id_user,
          name: `${rawData.first_name || ""} ${rawData.last_name || ""}`,
          avatar: rawData.avatar || "/default.jpg",
          jabatan: positionName,
          id_position: rawData.id_position || "-",
          id_department: rawData.id_department || "-",
          department: departemenName,
          nik: rawData.nik || "-",
          address: rawData.address || "-",
          tempat_lahir: rawData.tempat_lahir || "-",
          tanggal_lahir: rawData.tanggal_lahir || "-",
          jenis_kelamin: rawData.jenis_kelamin || "-",
          pendidikan: rawData.pendidikan || "-",
          phone_number: rawData.user?.phone_number || "-",
          email: rawData.user?.email || "-",
          dokumen: rawData.dokumen || [],
          start_date: rawData.start_date || "-",
          tenure: calculateTenure(rawData.start_date, rawData.end_date),

          end_date: rawData.end_date || "-",
          jadwal: rawData.jadwal || "-",
          tipe_kontrak: rawData.tipe_kontrak || "-",
          cabang: rawData.cabang || "-",
          employment_status: rawData.employment_status || "-",
          tanggal_efektif: rawData.tanggal_efektif || "-",
          bank: rawData.bank || "-",
          no_rek: rawData.no_rek || "-",
          gaji: gajiNum.toString(),
         
          uang_lembur: lemburNum.toString(),
          denda_terlambat: dendaNum.toString(),
          total_gaji: totalNum.toString(),
          first_name: rawData.first_name || "-",
          last_name: rawData.last_name || "-",
        };

        setKaryawan(mappedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan saat mengambil data karyawan.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params?.id]);

  const [dokumen, setDokumen] = React.useState<File[]>([]);
  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDokumen(Array.from(e.target.files));
    }
  };

  const employeeId = params?.id as string | undefined;

  const handleUpload = async () => {
    if (!employeeId) {
      alert("Employee ID tidak tersedia");
      return;
    }

    if (!dokumen || dokumen.length === 0) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    dokumen.forEach((file) => formData.append("dokumen[]", file));

    try {
      const response = await api.post(
        `/admin/employees/${employeeId}/upload-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Berhasil Menggunggah Dokumen.");

        const uploadedFiles = response.data.dokumen || [];

        // ✅ Tambahkan dokumen ke state karyawan tanpa reload
        setKaryawan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            dokumen: [
              ...(prev.dokumen || []),
              ...uploadedFiles.map((doc: any) => ({
                id: doc.id,
                dokumen: response.data.dokumen || [],
                name: doc.name,
                file: doc.file, // pastikan ini adalah full URL dari backend
                uploaded_at: new Date().toISOString(), // opsional
              })),
            ],
          };
        });

        // Kosongkan file input setelah upload
        setDokumen([]);
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const messages = Object.entries(errors)
          .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
          .join("\n");
        toast.error(`Validasi gagal:\n${messages}`);
      } else {
        toast.error(
          `Upload gagal: ${err.response?.data?.message || err.message}`
        );
      }
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 space-x-2">
        <span
          className="w-3 h-3 rounded-full bg-[#1E3A5F] animate-bounce"
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="w-3 h-3 rounded-full bg-[#1E3A5F] animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>
        <span
          className="w-3 h-3 rounded-full bg-[#1E3A5F] animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!karyawan) {
    return <div className="p-6">Data karyawan tidak ditemukan.</div>;
  }

  return (
     <div className="min-h-screen bg-gray-100 p-5">
       <ToastContainer />
       <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10">
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
          <div className="w-40 h-50 overflow-hidden mb-3 bg-gray-200 rectangle">
            <img
              src={karyawan.avatar || "/default.jpg"}
              alt={karyawan.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-lg">{karyawan.name}</p>
          <p className="text-sm text-gray-500">{karyawan.jabatan}</p>
          <p className="text-sm text-gray-500">{karyawan.department}</p>
        </div>

        {/* Detail Info */}
        <div className="flex-1 flex flex-col gap-y-10">
          <Section title="Informasi Pribadi">
            <FieldRow label="NIK" value={karyawan.nik} />
            <FieldRow label="Alamat" value={karyawan.address} />
            <FieldRow
              label="Tempat, Tgl Lahir"
              value={`${karyawan.tempat_lahir}, ${karyawan.tanggal_lahir}`}
            />
            <FieldRow label="Jenis Kelamin" value={karyawan.jenis_kelamin} />
            <FieldRow label="Pendidikan Terakhir" value={karyawan.pendidikan} />
            <FieldRow label="Email" value={karyawan.email} />
            <FieldRow label="No Telp" value={karyawan.phone_number} />
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-13">
            <Section title="Informasi Kepegawaian">
              <FieldRow label="Mulai Kerja" value={karyawan.start_date} />
              <FieldRow label="Masa Kerja" value={karyawan.tenure} />
              <FieldRow label="Akhir Kerja" value={karyawan.end_date} />
              <FieldRow label="Jadwal Kerja" value={karyawan.jadwal} />
              <FieldRow label="Tipe Kontrak" value={karyawan.tipe_kontrak} />
              <FieldRow label="Jabatan" value={karyawan.jabatan} />
              <FieldRow label="Departemen" value={karyawan.department} />
            
            
              <FieldRow label="Cabang" value={karyawan.cabang} />
              <FieldRow
                label="Status Kerja"
                value={karyawan.employment_status}
              />
            </Section>

            <Section title="Payroll">
              <FieldRow
                label="Tanggal Efektif"
                value={karyawan.tanggal_efektif}
              />
              <FieldRow label="Bank" value={karyawan.bank} />
              <FieldRow label="Nomer Rekening" value={karyawan.no_rek} />
              <FieldRow
                label="Gaji Pokok"
                value={formatRupiah(karyawan.gaji)}
              />
              {/* <FieldRow
                label="Uang Lembur"
                value={formatRupiah(karyawan.uang_lembur)}
              /> */}
              {/* <FieldRow
                label="Denda Terlambat"
                value={formatRupiah(karyawan.denda_terlambat)}
              />
              <FieldRow
                label="Total Gaji"
                value={formatRupiah(karyawan.total_gaji)}
              /> */}
            </Section>
          </div>
          <div className="w-full mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-[#1e293b]">
                  📂 Dokumen Karyawan
                </h2>
                <label
                  htmlFor="fileUpload"
                  className="flex items-center gap-2 bg-[#1E3A5F] text-white px-2 py-2 rounded-md shadow-md hover:bg-[#155A8A] cursor-pointer transition duration-200 select-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tambah Dokumen
                </label>
              </div>

              <input
                id="fileUpload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files);
                    setDokumen((prevFiles) => {
                      const combinedFiles = [...prevFiles];
                      newFiles.forEach((file) => {
                        if (
                          !combinedFiles.some(
                            (f) => f.name === file.name && f.size === file.size
                          )
                        ) {
                          combinedFiles.push(file);
                        }
                      });
                      return combinedFiles;
                    });
                  }
                }}
              />
            </div>

            {dokumen.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  📎 Dokumen yang dipilih:
                </h3>
                <ul className="mt-2 list-disc list-inside">
                  {dokumen.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
                <button
                  onClick={handleUpload}
                  className="mt-5 mb-5 bg-[#1E3A5F] text-white px-4 py-2 rounded"
                >
                  Upload Dokumen
                </button>
              </div>
            )}

            {karyawan.dokumen && karyawan.dokumen.length > 0 ? (
              <div className="w-full overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-[640px] w-full text-left text-sm text-gray-700 border border-gray-300">
                  <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 border-r border-gray-300">
                        Nama Dokumen
                      </th>
                      <th className="px-6 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karyawan.dokumen.map((doc, index) => (
                      <tr
                        key={doc.id ?? index}
                        className={`border-b border-gray-300 hover:bg-blue-50 transition duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 border-r border-gray-200 font-medium whitespace-nowrap">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDocument(doc.file)}
                            title="Lihat Dokumen"
                            className="text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-100 transition"
                            type="button"
                          >
                            <FaEye />
                          </button>
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
        </div>
      </div>
    </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center mb-3">
      <div className="sm:w-40 font-semibold text-gray-700">{label}</div>
      <div className="flex justify-center items-center w-6 text-gray-400 select-none">
        :
      </div>
      <div className="flex-1 text-gray-500 font-semibold">{value}</div>
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
