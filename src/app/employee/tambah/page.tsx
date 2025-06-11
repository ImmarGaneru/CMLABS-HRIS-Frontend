"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaCamera, FaFileUpload } from "react-icons/fa";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

type Position = {
  id: string;
  name: string;
  gaji: number;
};

type Department = {
  id: string;
  name: string;
};

export default function TambahKaryawan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
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
    employment_status: "active",
    tanggal_efektif: "",
    bank: "",
    no_rek: "",
    email: "",
    password: "",
    id_position: "",
    id_department: "",
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

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setFormData((prev) => ({ ...prev, id_department: deptId, id_position: "" }));
  };

  const handleJabatanChange = (selectedId: string) => {
    setFormData((prev) => ({ ...prev, id_position: selectedId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });

      // Append avatar if selected
      if (selectedAvatar) {
        data.append('avatar', selectedAvatar);
      }

      // Append documents if selected
      selectedDocuments.forEach((file) => {
        data.append('dokumen[]', file);
      });

      const response = await api.post('/admin/employees', data);

      if (response.data.meta?.success) {
        toast.success(response.data.meta.message || "Data berhasil ditambahkan!");
        setTimeout(() => {
          router.push("/employee");
        }, 1500);
      } else {
        throw new Error(response.data.meta?.message || "Gagal menambahkan data");
      }
    } catch (err: any) {
      console.error("Error details:", err.response?.data);
      const message = err.response?.data?.message || err.message || "Terjadi kesalahan.";
      toast.error(`Gagal menambahkan data: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="p-6 bg-white rounded shadow w-full mt-2 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#141414]">Tambah Karyawan</h1>
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
        {/* Avatar Upload */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-40 h-52 rounded-lg bg-gray-100 overflow-hidden shadow-md border border-gray-300 hover:border-blue-500 transition-all duration-300">
              <img
                src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : "/default.jpg"}
                alt="Avatar Preview"
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
            <div>
              <label className="block mb-1 font-semibold">Nama Depan</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Nama Belakang</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">NIK</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.nik}
                onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Alamat</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Tempat Lahir</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData(prev => ({ ...prev, tempat_lahir: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Tanggal Lahir</label>
              <input
                type="date"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.tanggal_lahir}
                onChange={(e) => setFormData(prev => ({ ...prev, tanggal_lahir: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Jenis Kelamin</label>
              <select
                className="border border-gray-300 rounded w-full p-2"
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData(prev => ({ ...prev, jenis_kelamin: e.target.value }))}
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Pendidikan Terakhir</label>
              <select
                className="border border-gray-300 rounded w-full p-2"
                value={formData.pendidikan}
                onChange={(e) => setFormData(prev => ({ ...prev, pendidikan: e.target.value }))}
              >
                <option value="">-- Pilih Pendidikan --</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">No Telp</label>
              <input
                type="text"
                className="border border-gray-300 rounded w-full p-2"
                value={formData.no_telp}
                onChange={(e) => setFormData(prev => ({ ...prev, no_telp: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Informasi Kepegawaian & Payroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">
              Informasi Kepegawaian
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Departemen</label>
                <select
                  className="border border-gray-300 rounded w-full p-2"
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  <option value="">-- Pilih Departemen --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Jabatan</label>
                <select
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.id_position}
                  onChange={(e) => handleJabatanChange(e.target.value)}
                  disabled={!selectedDepartment}
                >
                  <option value="">-- Pilih Jabatan --</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Mulai Kerja</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Akhir Kerja</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Jadwal Kerja</label>
                <select
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.jadwal}
                  onChange={(e) => setFormData(prev => ({ ...prev, jadwal: e.target.value }))}
                >
                  <option value="">-- Pilih Jadwal --</option>
                  <option value="Shift">Shift</option>
                  <option value="Non-Shift">Non-Shift</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Tipe Kontrak</label>
                <select
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.tipe_kontrak}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipe_kontrak: e.target.value }))}
                >
                  <option value="">-- Pilih Tipe Kontrak --</option>
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Magang">Magang</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Cabang</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.cabang}
                  onChange={(e) => setFormData(prev => ({ ...prev, cabang: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Status Kerja</label>
                <select
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.employment_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, employment_status: e.target.value }))}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="resign">Resign</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">Payroll</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Tanggal Efektif</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.tanggal_efektif}
                  onChange={(e) => setFormData(prev => ({ ...prev, tanggal_efektif: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Bank</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.bank}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Nomor Rekening</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={formData.no_rek}
                  onChange={(e) => setFormData(prev => ({ ...prev, no_rek: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dokumen */}
        <div className="relative mb-24">
          <div className="w-full mt-10">
            <h2 className="text-2xl font-semibold text-[#1e293b] mb-4 border-b pb-2">
              📂 Dokumen Karyawan
            </h2>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedDocuments(Array.from(e.target.files));
                  }
                }}
                className="input-file w-full border p-3 rounded-md cursor-pointer hover:border-blue-500 pl-12"
              />
              <FaFileUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600" />
            </div>
            {selectedDocuments.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {selectedDocuments.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
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
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
