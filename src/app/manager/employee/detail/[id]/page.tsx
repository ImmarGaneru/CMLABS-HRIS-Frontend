/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaEye, FaTrash } from "react-icons/fa";
import React from "react";
import api from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";

type Dokumen = {
  id: string;
  name: string;
  file: string;
  uploaded_at?: string;
};

type Karyawan = {
  id: string;
  id_user: string;
  id_position: string;
  name: string;
  avatar: string;
  first_name: string;
  last_name: string;
  jabatan: string;
  nik: string;
  address: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  pendidikan: string;
  email: string;
  no_telp: string;
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
  position?: {
    id: string;
    name: string;
    gaji: number;
  };
  user?: {
    id: string;
    email: string;
  };
};

export default function DetailKaryawan() {
  const router = useRouter();
  const params = useParams();
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dokumen, setDokumen] = React.useState<File[]>([]);

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

  useEffect(() => {
    const id = params?.id as string;
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

        if (!rawData) {
          throw new Error("Data karyawan tidak ditemukan");
        }

        const gajiNum = parseRupiahToNumber(rawData.gaji);
        const lemburNum = parseRupiahToNumber(rawData.uang_lembur);
        const dendaNum = parseRupiahToNumber(rawData.denda_terlambat);
        const totalNum = gajiNum + lemburNum - dendaNum;

        const mappedData: Karyawan = {
          id: rawData.id,
          id_user: rawData.id_user,
          id_position: rawData.id_position,
          name: `${rawData.first_name} ${rawData.last_name}`,
          avatar: rawData.avatar || "/default.jpg",
          first_name: rawData.first_name,
          last_name: rawData.last_name,
          jabatan: rawData.position?.name || "-",
          nik: rawData.nik || "-",
          address: rawData.address,
          tempat_lahir: rawData.tempat_lahir,
          tanggal_lahir: rawData.tanggal_lahir,
          jenis_kelamin: rawData.jenis_kelamin,
          pendidikan: rawData.pendidikan,
          email: rawData.user?.email || "-",
          no_telp: rawData.no_telp,
          dokumen: rawData.documents || [],
          start_date: rawData.start_date || "-",
          tenure: rawData.tenure || "-",
          end_date: rawData.end_date || "-",
          jadwal: rawData.jadwal,
          tipe_kontrak: rawData.tipe_kontrak,
          cabang: rawData.cabang,
          employment_status: rawData.employment_status || "-",
          tanggal_efektif: rawData.tanggal_efektif || "-",
          bank: rawData.bank,
          no_rek: rawData.no_rek,
          gaji: gajiNum.toString(),
          uang_lembur: lemburNum.toString(),
          denda_terlambat: dendaNum.toString(),
          total_gaji: totalNum.toString(),
          position: rawData.position,
          user: rawData.user
        };

        setKaryawan(mappedData);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Gagal mengambil data karyawan";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params?.id]);

  const handleUpload = async () => {
    const employeeId = params?.id as string;
    if (!employeeId) {
      toast.error("Employee ID tidak tersedia");
      return;
    }

    if (!dokumen || dokumen.length === 0) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    dokumen.forEach((file) => formData.append("dokumen[]", file));

    try {
      const response = await api.post(
        `/admin/employees/${employeeId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Berhasil Menggunggah Dokumen.");
        setDokumen([]);

        // Refresh employee data to get updated documents
        const updatedResponse = await api.get(`/admin/employees/${employeeId}`);
        const updatedData = updatedResponse.data.data;
        
        setKaryawan(prev => prev ? {
          ...prev,
          dokumen: updatedData.documents || []
        } : null);
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const messages = Object.entries(errors)
          .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
          .join("\n");
        toast.error(`Validasi gagal:\n${messages}`);
      } else if (err.response) {
        toast.error(
          `Upload gagal: ${err.response.data.message || err.response.statusText}`
        );
      } else if (err.request) {
        toast.error("Tidak ada respon dari server.");
      } else {
        toast.error(`Terjadi error: ${err.message}`);
      }
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    const employeeId = params?.id as string;
    if (!employeeId) {
      toast.error("Employee ID tidak tersedia");
      return;
    }

    const confirmDelete = window.confirm("Yakin ingin menghapus dokumen ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/employees/${employeeId}/documents/${docId}`);
      toast.success("Dokumen berhasil dihapus");

      // Refresh employee data
      const updatedResponse = await api.get(`/admin/employees/${employeeId}`);
      const updatedData = updatedResponse.data.data;
      
      setKaryawan(prev => prev ? {
        ...prev,
        dokumen: updatedData.documents || []
      } : null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus dokumen");
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!karyawan)
  return <div className="p-6">Data karyawan tidak ditemukan.</div>;

  const formatTanggal = (tanggal: string): string => {
    if (!tanggal) return '-';
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="px-6 py-4 bg-white rounded shadow w-full mt-2 min-h-screen font-sans">
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

      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Foto dan Identitas */}
        <div className="flex flex-col items-start justify-center">
          <div className="w-40 h-50 overflow-hidden mb-3 bg-gray-200 rectangle">
            <img
              src={karyawan.avatar || '\public\default.jpg'}
              alt={karyawan.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center font-bold text-lg">{karyawan.name}</p>
          <p className="text-sm text-gray-500">{karyawan.jabatan}</p>
        </div>

        {/* Detail Info */}
        <div className="flex-1 flex flex-col gap-y-4">
            <div className="flex-1 flex flex-col gap-y-6">
              {/* Informasi Pribadi */}
              <div className="bg-white rounded-lg shadow p-6">
                <Section title="Informasi Pribadi">
                  <FieldRow label="NIK" value={karyawan.nik || '-'} />
                  <FieldRow label="Alamat" value={karyawan.address || '-'} />
                  <FieldRow
                    label="Tempat, Tgl Lahir"
                    value={
                      karyawan.tempat_lahir && karyawan.tanggal_lahir
                        ? `${karyawan.tempat_lahir}, ${formatTanggal(karyawan.tanggal_lahir)}`
                        : '-'
                    }
                  />
                  <FieldRow label="Jenis Kelamin" value={karyawan.jenis_kelamin || '-'} />
                  <FieldRow label="Pendidikan Terakhir" value={karyawan.pendidikan || '-'} />
                  <FieldRow label="Email" value={karyawan.email || '-'} />
                  <FieldRow label="No Telp" value={karyawan.no_telp || '-'} />
                </Section>
              </div>

              {/* Informasi Kepegawaian */}
              <div className="bg-white rounded-lg shadow p-6">
                <Section title="Informasi Kepegawaian">
                  <FieldRow
                    label="Mulai Kerja"
                    value={karyawan.start_date ? formatTanggal(karyawan.start_date) : '-'}
                  />
                  <FieldRow label="Masa Kerja" value={karyawan.tenure || '-'} />
                  <FieldRow
                    label="Akhir Kerja"
                    value={karyawan.end_date ? formatTanggal(karyawan.end_date) : '-'}
                  />
                  <FieldRow label="Jadwal Kerja" value={karyawan.jadwal || '-'} />
                  <FieldRow label="Tipe Kontrak" value={karyawan.tipe_kontrak || '-'} />
                  <FieldRow label="Jabatan" value={karyawan.jabatan || '-'} />
                  <FieldRow label="Cabang" value={karyawan.cabang || '-'} />
                  <FieldRow
                    label="Status Kerja"
                    value={karyawan.employment_status || '-'}
                  />
                </Section>
              </div>

              {/* Payroll */}
              <div className="bg-white rounded-lg shadow p-6">
                <Section title="Payroll">
                  <FieldRow
                    label="Tanggal Efektif"
                    value={karyawan.tanggal_efektif ? formatTanggal(karyawan.tanggal_efektif) : '-'}
                  />
                  <FieldRow label="Bank" value={karyawan.bank || '-'} />
                  <FieldRow label="Nomor Rekening" value={karyawan.no_rek || '-'} />
                  <FieldRow
                    label="Gaji Pokok"
                    value={formatRupiah(karyawan.gaji)}
                  />
                  <FieldRow
                    label="Uang Lembur"
                    value={formatRupiah(karyawan.uang_lembur)}
                  />
                  <FieldRow
                    label="Denda Terlambat"
                    value={formatRupiah(karyawan.denda_terlambat)}
                  />
                  <FieldRow
                    label="Total Gaji"
                    value={formatRupiah(karyawan.total_gaji)}
                  />
                </Section>
              </div>
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
                <ToastContainer />
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
                        key={doc.id}
                        className={`border-b border-gray-300 hover:bg-blue-50 transition duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 border-r border-gray-200 font-medium whitespace-nowrap">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => handleViewDocument(doc.file)}
                            title="Lihat Dokumen"
                            className="text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-100 transition"
                            type="button"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="Hapus Dokumen"
                            className="text-red-600 border border-red-600 rounded-md px-3 py-1 hover:bg-red-100 transition"
                            type="button"
                          >
                            <FaTrash />
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