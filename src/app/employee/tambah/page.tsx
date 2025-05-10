"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";

import { FaFileUpload } from "react-icons/fa"; // Import the icons
export default function TambahKaryawan() {
  const router = useRouter();
  const handleBack = () => {
    router.push("/employee");
  };

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    nomor: "",
    email: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    pendidikan: "",
    jadwal: "",
    tipeKontrak: "Tetap",
    grade: "",
    jabatan: "",
    cabang: "",
    bank: "",
    norek: "",
    dokumen: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, dokumen: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted (mock)", formData);
  };

  return (
    <div className="mt-3 p-6 bg-white rounded shadow w-full ml-0 mr-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#1E3A5F]">
          Tambah Karyawan Baru
        </h1>

        <button
          type="button"
          onClick={handleBack}
          className="flex items-center bg-[#1E3A5F] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#155A8A] transition duration-200 ease-in-out"
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
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="col-span-2 flex items-center gap-4">
          <div className="w-36 h-36 rounded bg-gray-300 overflow-hidden">
            {" "}
            {/* Menyesuaikan ukuran */}
            {preview && (
              <img
                src={preview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            className="flex bg-[#1E3A5F] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#155A8A]"
          >
            Upload Avatar
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <label
            htmlFor="nama"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nama
          </label>
          <input
            id="nama"
            name="nama"
            placeholder="Enter employee name"
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="nik"
            className="block text-[20px] font-bold text-[#141414]"
          >
            NIK
          </label>
          <input
            id="nik"
            name="nik"
            placeholder="Enter employee NIK"
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="alamat"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            placeholder="Enter address"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="nomor"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nomor Telepon
          </label>
          <input
            id="nomor"
            name="nomor"
            placeholder="Enter employee phone number"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter employee Email"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="jenisKelamin"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Jenis Kelamin
          </label>
          <select
            id="jenisKelamin"
            name="jenisKelamin"
            onChange={handleChange}
            className="input"
          >
            <option value="">-Select Gender-</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tempatLahir"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tempat Lahir
          </label>
          <input
            id="tempatLahir"
            name="tempatLahir"
            placeholder="Enter birth place"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="tanggalLahir"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tanggal Lahir
          </label>
          <input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="pendidikan"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Pendidikan Terakhir
          </label>
          <select
            id="pendidikan"
            name="pendidikan"
            onChange={handleChange}
            className="input"
          >
            <option value="">-Select Last Education-</option>
            <option value="SMA">SMA</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="jadwal"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Jadwal Kerja
          </label>
          <select
            id="jadwal"
            name="jadwal"
            onChange={handleChange}
            className="input"
          >
            <option value="">Select employee work schedule</option>
            <option value="Shift">Shift</option>
            <option value="Non-Shift">Non-Shift</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tipeKontrak"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tipe Kontrak
          </label>
          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center cursor-pointer hover:text-blue-500">
              <input
                type="radio"
                name="tipeKontrak"
                value="Tetap"
                checked={formData.tipeKontrak === "Tetap"}
                onChange={handleChange}
              />{" "}
              Tetap
            </label>
            <label className="flex items-center cursor-pointer hover:text-blue-500">
              <input
                type="radio"
                name="tipeKontrak"
                value="Kontrak"
                checked={formData.tipeKontrak === "Kontrak"}
                onChange={handleChange}
              />{" "}
              Kontrak
            </label>
            <label className="flex items-center cursor-pointer hover:text-blue-500">
              <input
                type="radio"
                name="tipeKontrak"
                value="Lepas"
                checked={formData.tipeKontrak === "Lepas"}
                onChange={handleChange}
              />{" "}
              Lepas
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Grade
          </label>
          <input
            id="grade"
            name="grade"
            placeholder="Enter employee grade"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="jabatan"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Jabatan
          </label>
          <input
            id="jabatan"
            name="jabatan"
            placeholder="Enter employee position"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="cabang"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Cabang
          </label>
          <input
            id="cabang"
            name="cabang"
            placeholder="Enter employee department"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="bank"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Bank
          </label>
          <input
            id="bank"
            name="bank"
            placeholder="Enter Bank name"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="norek"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nomor Rekening
          </label>
          <input
            id="norek"
            name="norek"
            placeholder="Enter employee bank number"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[20px] font-bold text-[#141414]">
            Upload Dokumen
          </label>
          <div className="relative">
            {/* Input file dengan ikon di dalamnya */}
            <input
              name="dokumen"
              type="file"
              accept=".pdf,.docx"
              onChange={handleChange}
              className="input-file w-full border p-3 rounded-md cursor-pointer hover:border-blue-500 pl-12"
            />
            {/* Ikon upload ditempatkan di dalam input */}
            <FaFileUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600" />
          </div>
        </div>

        <div className="col-span-2 flex justify-end gap-4">
          <button
            type="button"
            className="text-blue-500 cursor-pointer hover:text-blue-700"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-[#1E3A5F] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#155A8A]"
            onClick={() => (window.location.href = "/employee")}
          >
            Simpan
          </button>
        </div>
      </form>

      <style jsx>{`
        .input {
          border: 1px solid #ccc;
          padding: 0.5rem;
          border-radius: 0.25rem;
          width: 100%;
        }
        .input-file {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
