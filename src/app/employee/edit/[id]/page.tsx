/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FaCamera, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Dokumen = {
  file: string | URL | undefined;
  id: string;
  name: string;
  url: string;
};

type Karyawan = {
  id: string;
  id_user: string;
  id_position: string;
  id_department: string;
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
  end_date: string;
  tenure: string;
  jadwal: string;
  tipe_kontrak: string;
  cabang: string;
  employment_status: string;
  tanggal_efektif: string;
  bank: string;
  no_rek: string;
  gaji: number;
  uang_lembur: number;
  denda_terlambat: number;
  total_gaji: number;
  avatar: string;
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

type EditableFieldProps = {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  type?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  readOnly?: boolean;
};

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  disabled = false,
  readOnly = false,
}: EditableFieldProps) {
  if (type === "select") {
    return (
      <div>
        <label className="block mb-1 font-semibold">{label}</label>
        <select
          className="border border-gray-300 rounded w-full p-2"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">-- Pilih {label} --</option>
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
      />
    </div>
  );
}

type FormData = {
  id: string;
  id_user: string;
  id_position: string;
  id_department: string;
  first_name: string;
  last_name: string;
  nik: string;
  address: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  pendidikan: string;
  no_telp: string;
  start_date: string;
  end_date: string;
  jadwal: string;
  tipe_kontrak: string;
  cabang: string;
  employment_status: string;
  tanggal_efektif: string;
  bank: string;
  no_rek: string;
  email: string;
  dokumen: File | null;
};

export default function EditKaryawan() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ id: string; name: string; gaji: number }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    id_user: "",
    id_position: "",
    id_department: "",
    first_name: "",
    last_name: "",
    nik: "",
    address: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pendidikan: "",
    no_telp: "",
    start_date: "",
    end_date: "",
    jadwal: "",
    tipe_kontrak: "",
    cabang: "",
    employment_status: "",
    tanggal_efektif: "",
    bank: "",
    no_rek: "",
    email: "",
    dokumen: null,
  });

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await api.get("/admin/departments");
        setDepartments(response.data.data);
      } catch (err) {
        console.error("Gagal ambil daftar departemen", err);
      }
    }

    fetchDepartments();
  }, []);

  // Fetch positions by department
  useEffect(() => {
    async function fetchPositionsByDepartment() {
      if (!selectedDepartment) return;
      try {
        const res = await api.get(`/admin/positions/${selectedDepartment}`);
        setPositions(
          res.data.data.map((pos: any) => ({
            id: pos.id,
            name: pos.name,
            gaji: pos.gaji ?? 0,
          }))
        );
      } catch (err) {
        console.error("Gagal ambil jabatan", err);
      }
    }

    fetchPositionsByDepartment();
  }, [selectedDepartment]);

  // Load employee data
  useEffect(() => {
    if (!params?.id) return;

    async function fetchEmployee() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/admin/employees/${params.id}`);
        const rawData = res.data.data;

        if (!rawData) throw new Error("Data karyawan tidak ditemukan");

        const mappedData: FormData = {
          id: rawData.id,
          id_user: rawData.id_user,
          id_position: rawData.id_position || "",
          id_department: rawData.id_department || "",
          first_name: rawData.first_name || "",
          last_name: rawData.last_name || "",
          nik: rawData.nik || "",
          address: rawData.address || "",
          tempat_lahir: rawData.tempat_lahir || "",
          tanggal_lahir: rawData.tanggal_lahir || "",
          jenis_kelamin: rawData.jenis_kelamin || "",
          pendidikan: rawData.pendidikan || "",
          email: rawData.user?.email || "-",
          no_telp: rawData.no_telp || "",
          start_date: rawData.start_date || "",
          end_date: rawData.end_date || "",
          jadwal: rawData.jadwal || "",
          tipe_kontrak: rawData.tipe_kontrak || "",
          cabang: rawData.cabang || "",
          employment_status: rawData.employment_status || "",
          tanggal_efektif: rawData.tanggal_efektif || "",
          bank: rawData.bank || "",
          no_rek: rawData.no_rek || "",
          dokumen: null,
        };

        setFormData(mappedData);
        setSelectedDepartment(mappedData.id_department);
        setKaryawan({
          ...mappedData,
          avatar: rawData.avatar || "/default.jpg",
          jabatan: rawData.position?.name || "",
          gaji: rawData.position?.gaji || 0,
          uang_lembur: 0,
          denda_terlambat: 0,
          total_gaji: 0,
          dokumen: rawData.documents || [],
          tenure: rawData.tenure || "",
        });
      } catch (err) {
        setError("Gagal mengambil data karyawan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [params?.id]);

  const handleJabatanChange = (selectedId: string) => {
    setFormData((prev) => ({ ...prev, id_position: selectedId }));
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setFormData((prev) => ({ ...prev, id_department: deptId, id_position: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = params?.id;
    if (!id) {
      toast.error("ID karyawan tidak ditemukan");
      return;
    }

    const validStatuses = ["active", "inactive", "resign"];
    if (!validStatuses.includes(formData.employment_status)) {
      toast.error(`Status kerja harus salah satu dari: ${validStatuses.join(", ")}`);
      return;
    }

    try {
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        nik: formData.nik,
        address: formData.address,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: formData.tanggal_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        pendidikan: formData.pendidikan,
        no_telp: formData.no_telp,
        jadwal: formData.jadwal,
        tipe_kontrak: formData.tipe_kontrak,
        cabang: formData.cabang,
        employment_status: formData.employment_status,
        bank: formData.bank,
        no_rek: formData.no_rek,
        id_position: formData.id_position,
        id_department: formData.id_department,
        start_date: formData.start_date,
        end_date: formData.end_date,
        tanggal_efektif: formData.tanggal_efektif
      };

      console.log("Sending data:", dataToSend);

      const response = await api.put(`/admin/employees/${id}`, dataToSend);

      if (response.data.meta?.success) {
        toast.success(response.data.meta.message || "Data berhasil diperbarui!");
        setTimeout(() => {
          router.push("/employee");
        }, 1500);
      } else {
        throw new Error(response.data.meta?.message || "Gagal memperbarui data");
      }
    } catch (err: any) {
      console.error("Error details:", err.response?.data);
      const message = err.response?.data?.message || err.message || "Terjadi kesalahan.";
      toast.error(`Gagal memperbarui data: ${message}`);
    }
  };

  if (loading) return <div className="p-4">Memuat data...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
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

        {/* Avatar Upload */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-40 h-52 rounded-lg bg-gray-100 overflow-hidden shadow-md border border-gray-300 hover:border-blue-500 transition-all duration-300">
              <img
                src={
                  selectedAvatar
                    ? URL.createObjectURL(selectedAvatar)
                    : karyawan.avatar || "/default.jpg"
                }
                alt={karyawan.first_name + " " + karyawan.last_name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="avatarUpload"
              className="cursor-pointer flex flex-col items-center justify-center px-4 py-3 bg-[#1E3A5F] text-white rounded-md shadow-md hover:bg-[#155A8A] transition-colors duration-300"
            >
              <FaCamera className="mb-2" />
              <span className="text-sm font-semibold">Ubah Foto</span>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedAvatar(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          {selectedAvatar && (
            <p className="text-gray-600 italic text-sm">
              File terpilih: {selectedAvatar.name}
            </p>
          )}
        </div>

        {/* Informasi Pribadi */}
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
              value={formData.nik}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, nik: v }))
              }
            />
            <EditableField
              label="Alamat"
              value={formData.address}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, address: v }))
              }
            />
            <EditableField
              label="Tempat Lahir"
              value={formData.tempat_lahir}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, tempat_lahir: v }))
              }
            />
            <EditableField
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, tanggal_lahir: v }))
              }
            />
            <EditableField
              label="Jenis Kelamin"
              type="select"
              value={formData.jenis_kelamin}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, jenis_kelamin: v }))
              }
              options={[
                { value: "", label: "-- Pilih Jenis Kelamin --" },
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ]}
            />
            <EditableField
              label="Pendidikan Terakhir"
              type="select"
              value={formData.pendidikan}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, pendidikan: v }))
              }
              options={[
                { value: "", label: "-- Pilih Pendidikan --" },
                { value: "SMA/SMK", label: "SMA/SMK" },
                { value: "D3", label: "D3" },
                { value: "S1", label: "S1" },
                { value: "S2", label: "S2" },
                { value: "S3", label: "S3" },
              ]}
            />
            <EditableField
              label="Email"
              value={formData.email}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, email: v }))
              }
              readOnly
            />
            <EditableField
              label="No Telp"
              value={formData.no_telp}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, no_telp: v }))
              }
            />
          </div>
        </div>

        {/* Informasi Kepegawaian & Payroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">
              Informasi Kepegawaian
            </h2>
            <div className="space-y-4">
              <EditableField
                label="Departemen"
                type="select"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                options={departments.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <EditableField
                label="Jabatan"
                type="select"
                value={formData.id_position}
                onChange={handleJabatanChange}
                options={positions.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                disabled={!selectedDepartment}
              />
              <EditableField
                label="Mulai Kerja"
                type="date"
                value={formData.start_date}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, start_date: v }))
                }
              />
              <EditableField
                label="Akhir Kerja"
                type="date"
                value={formData.end_date}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, end_date: v }))
                }
              />
              <EditableField
                label="Jadwal Kerja"
                type="select"
                value={formData.jadwal}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, jadwal: v }))
                }
                options={[
                  { value: "", label: "-- Pilih Jadwal --" },
                  { value: "Shift", label: "Shift" },
                  { value: "Non-Shift", label: "Non-Shift" },
                ]}
              />
              <EditableField
                label="Tipe Kontrak"
                type="select"
                value={formData.tipe_kontrak}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, tipe_kontrak: v }))
                }
                options={[
                  { value: "Tetap", label: "Tetap" },
                  { value: "Kontrak", label: "Kontrak" },
                  { value: "Magang", label: "Magang" },
                ]}
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
                  { value: "active", label: "Aktif" },
                  { value: "inactive", label: "Tidak Aktif" },
                  { value: "resign", label: "Resign" },
                ]}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">Payroll</h2>
            <div className="space-y-4">
              <EditableField
                label="Tanggal Efektif"
                type="date"
                value={formData.tanggal_efektif}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, tanggal_efektif: v }))
                }
                disabled
              />
              <EditableField
                label="Bank"
                value={formData.bank}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, bank: v }))
                }
              />
              <EditableField
                label="Nomor Rekening"
                value={formData.no_rek}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, no_rek: v }))
                }
              />
            </div>
          </div>
        </div>

        {/* Dokumen */}
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
                      <th className="px-6 py-3 border-r border-gray-300">
                        Nama Dokumen
                      </th>
                      <th className="px-6 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karyawan.dokumen.map((doc, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-300 hover:bg-blue-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 border-r border-gray-200">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            title="Detail"
                            onClick={() => window.open(doc.file, "_blank")}
                            className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                          >
                            <FaEye />
                          </button>
                          <button
                            title="Hapus"
                            onClick={() => {
                              if (
                                confirm("Yakin ingin menghapus dokumen ini?")
                              ) {
                                // Tambahkan logika delete dokumen di sini
                              }
                            }}
                            className="border border-red-600 ml-2 px-3 py-1 rounded text-red-600 bg-[#f8f8f8] hover:bg-red-100"
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
              <p className="text-sm text-gray-600 italic">
                Tidak ada dokumen
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-blue-500 hover:text-blue-700"
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
      </form>
    </div>
  );
}