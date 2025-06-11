"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { FaCamera, FaFileUpload } from "react-icons/fa";
import { createEmployee } from "../../../../utils/employee";
import { getPositions } from "../../../../utils/position";
import { toast } from "react-hot-toast";

export default function TambahKaryawan() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [positions, setPositions] = useState<
    { id: string; name: string; gaji: number }[]
  >([]);

  const [formData, setFormData] = useState({
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
    id_position: "",
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
    dokumen: [] as File[],
    employment_status: "active",
  });

  interface PositionResponse {
    id: string | number;
    name: string;
    gaji?: number | null;
  }

  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await getPositions();
        const mapped = response.data.map((pos: PositionResponse) => ({
          id: pos.id.toString(),
          name: pos.name,
          gaji: pos.gaji ?? 0,
        }));
        setPositions(mapped);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    }

    fetchPositions();
  }, []);

  const handleBack = () => router.push("/employee");

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const [dokumen, setDokumen] = useState<File[]>([]);

const handleDokumenChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    setDokumen((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      dokumen: [...prev.dokumen, ...files],
    }));
  }
};



  const handleJabatanChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedPosition = positions.find((pos) => pos.id === selectedId);

    setFormData((prev) => ({
      ...prev,
      id_position: selectedId,
      jabatan: selectedPosition?.name ?? "",
      gaji: selectedPosition?.gaji ?? 0,
      TotalGaji:
        (selectedPosition?.gaji ?? 0) + prev.uangLembur - prev.dendaTerlambat,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (updated.startDate) {
        const start = new Date(updated.startDate);
        const end = updated.endDate ? new Date(updated.endDate) : new Date();

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
          months--;
          days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }

        if (months < 0) {
          years--;
          months += 12;
        }

        updated.tenure = `${years} tahun ${months} bulan ${days} hari`;
      } else {
        updated.tenure = "";
      }

      return updated;
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedValue: string | number = value;

      if (["gaji", "uangLembur", "dendaTerlambat"].includes(name)) {
        updatedValue = parseFloat(value) || 0;
      }

      const updated = {
        ...prev,
        [name]: updatedValue,
      };

      updated.TotalGaji =
        (typeof updated.gaji === "number"
          ? updated.gaji
          : parseFloat(updated.gaji)) +
        (typeof updated.uangLembur === "number"
          ? updated.uangLembur
          : parseFloat(updated.uangLembur)) -
        (typeof updated.dendaTerlambat === "number"
          ? updated.dendaTerlambat
          : parseFloat(updated.dendaTerlambat));

      return updated;
    });
  };
  function isUUID(str: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!isUUID(formData.id_position)) {
    alert("ID posisi harus dalam format UUID yang benar!");
    return;
  }

  try {
    const data = new FormData();

    // Map form fields to API field names
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "dokumen") return; // Handle dokumen separately
      if (key === "avatar" && value instanceof File) {
        data.append(key, value);
        return;
      }
      if (value !== null && value !== undefined) {
        // Convert field names to match API expectations
        const apiKey = key
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '');
        data.append(apiKey, value.toString());
      }
    });

    // Handle document uploads
    formData.dokumen.forEach((file) => {
      data.append("dokumen[]", file);
    });

    await createEmployee(data);
    toast.success("Data berhasil ditambahkan");
    router.push("/employee");
  } catch (error: any) {
    if (error.response?.data) {
      toast.error(
        "Gagal menambahkan data karyawan:\n" +
          JSON.stringify(error.response.data, null, 2)
      );
      console.error("Detail error:", error.response.data);
    } else {
      toast.error("Gagal menambahkan data karyawan.");
      console.error(error);
    }
  }
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
          <div className="w-40 h-52 rounded bg-gray-300 overflow-hidden">
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
          <label
            onClick={handleUploadClick}
            htmlFor="avatarUpload"
            className="cursor-pointer flex flex-col items-center justify-center px-4 py-3 bg-[#1E3A5F]  text-white rounded-md shadow-md hover:bg-[#155A8A]  transition-colors duration-300"
            title="Upload Foto Avatar"
          >
            <FaCamera className="mb-2 text-lg" />
            <span className="text-sm font-semibold">Upload Foto</span>
          </label>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <label
            htmlFor="id_user"
            className="block text-[20px] font-bold text-[#141414]"
          >
            ID User
          </label>
          <input
            id="id_user"
            name="id_user"
            placeholder="Enter ID User"
            onChange={handleChange}
            className="input"
            value={formData.id_user}
          />
        </div>
        <div>
          <label
            htmlFor="id_user"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nama Depan
          </label>
          <input
            id="first_name"
            name="first_name"
            placeholder="Enter first name"
            onChange={handleChange}
            className="input"
            value={formData.first_name}
          />
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nama Belakang
          </label>
          <input
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            onChange={handleChange}
            className="input"
            value={formData.last_name}
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
            type="number"
            placeholder="Enter NIK"
            onChange={handleChange}
            className="input"
            value={formData.nik}
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Alamat
          </label>
          <input
            id="address"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            className="input"
            value={formData.address}
          />
        </div>

        <div>
          <label
            htmlFor="notelp"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nomor Telepon
          </label>
          <input
            id="notelp"
            name="notelp"
            type="number"
            placeholder="Enter phone number"
            onChange={handleChange}
            className="input"
            value={formData.notelp}
          />
        </div>

        {/* <div>
          <label
            htmlFor="email"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            className="input"
            value={formData.email}
          />
        </div> */}

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
            placeholder="Enter birthplace"
            onChange={handleChange}
            className="input"
            value={formData.tempatLahir}
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
            value={formData.tanggalLahir}
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
            value={formData.jenisKelamin}
          >
            <option value="">-Select Gender-</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
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
            value={formData.pendidikan}
          >
            <option value="">-Pilih Pendidikan-</option>
            <option value="SMA/SMK">SMA/SMK</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
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
            value={formData.jadwal}
          >
            <option value="">Select work schedule</option>
            <option value="Shift">Shift</option>
            <option value="Non-Shift">Non-Shift</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Mulai Kerja
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleDateChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Akhir Kerja
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleDateChange}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="tanggalEfektif"
          className="block text-[20px] font-bold text-[#141414]">
            Tanggal Efektif
          </label>
          <input type="date"
          id="tanggalEfektif"
          name="tanggalEfektif"
          value={formData.tanggalEfektif}
          onChange={handleDateChange}
          className="input" />
        </div>

        <div>
          <label
            htmlFor="tenure"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Masa Kerja
          </label>
          <input
            type="text"
            id="tenure"
            name="tenure"
            value={formData.tenure}
            readOnly
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="tipeKontrak"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tipe Kontrak
          </label>
          <div className="flex items-center gap-4 col-span-2">
            {["Tetap", "Kontrak", "Resign"].map((val) => (
              <label
                key={val}
                className="flex items-center cursor-pointer hover:text-blue-500"
              >
                <input
                  type="radio"
                  name="tipeKontrak"
                  value={val}
                  checked={formData.tipeKontrak === val}
                  onChange={handleChange}
                />
                {" " + val}
              </label>
            ))}
          </div>
        </div>

        {/* <div>
          <label
            htmlFor="grade"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Grade
          </label>
          <input
            id="grade"
            name="grade"
            placeholder="Enter grade"
            onChange={handleChange}
            className="input"
            value={formData.grade}
          />
        </div> */}

        <div>
          <label
            htmlFor="id_position"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Jabatan
          </label>
          <select
            id="id_position"
            name="id_position"
            onChange={handleJabatanChange}
            className="input"
            value={formData.id_position || ""}
            required
          >
            <option value="">- Pilih Jabatan -</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="gaji"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Gaji
          </label>
          <input
            id="gaji"
            name="gaji"
            type="number"
            className="input"
            value={formData.gaji}
            readOnly
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
            placeholder="Enter branch"
            onChange={handleChange}
            className="input"
            value={formData.cabang}
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
            placeholder="Enter bank name"
            onChange={handleChange}
            className="input"
            value={formData.bank}
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
            type="number"
            placeholder="Enter bank account number"
            onChange={handleChange}
            className="input"
            value={formData.norek}
          />
        </div>

        <div>
          <label
            htmlFor="uangLembur"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Uang Lembur
          </label>
          <input
            id="uangLembur"
            name="uangLembur"
            type="number"
            placeholder="Enter overtime pay"
            onChange={handleChange}
            className="input"
            value={formData.uangLembur}
          />
        </div>
        <div>
          <label
            htmlFor="dendaTerlambat"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Denda Terlambat
          </label>
          <input
            id="dendaTerlambat"
            name="dendaTerlambat"
            type="number"
            placeholder="Enter late fine"
            onChange={handleChange}
            className="input"
            value={formData.dendaTerlambat}
          />
        </div>
        <div>
          <label
            htmlFor="TotalGaji"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Total Gaji
          </label>
          <input
            id="TotalGaji"
            name="TotalGaji"
            type="number"
            placeholder="Enter total salary"
            onChange={handleChange}
            className="input"
            value={formData.TotalGaji}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[20px] font-bold text-[#141414]">
            Upload Dokumen
          </label>
          <div className="relative">
            <input
              name="dokumen[]"
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={handleDokumenChange}
              className="input-file w-full border p-3 rounded-md cursor-pointer hover:border-blue-500 pl-12"
            />
            <FaFileUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600" />
          </div>

          {/* Contoh tampil nama file yang sudah dipilih */}
          {dokumen.length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {dokumen.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-2 flex justify-end gap-4">
          <button
            type="button"
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => (window.location.href = "/employee")}
          >
            Batal
          </button>
          {/* Submit Button */}
          <div className="col-span-2 text-right">
            <button
              type="submit"
              className="bg-[#1E3A5F] text-white px-6 py-2 rounded hover:bg-[#155A8A]"
            >
              Simpan
            </button>
          </div>
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
