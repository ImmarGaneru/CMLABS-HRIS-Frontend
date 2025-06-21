"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { FaCamera, FaFileUpload } from "react-icons/fa";
import api from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    id_user: "",
    password: "",
    avatar: null as File | null,
    first_name: "",
    last_name: "",
    nik: "",
    address: "",
    phone_number: "",
    email: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pendidikan: "",
    jadwal: "",
    tipe_kontrak: "Tetap",
    grade: "",
    jabatan: "",
    id_position: "", // id dari posisi yang dipilih
    cabang: "",
    bank: "",
    no_rek: "",
    start_date: "",
    end_date: "",
    tenure: "",
    tanggal_efektif: "",
    gaji: 0,
    uang_lembur: 0,
    denda_terlambat: 0,
    total_gaji: 0,
    dokumen: [] as File[],
  });



  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setFormData((prev) => ({
      ...prev,
      id_department: deptId,
      id_position: "",
    }));
  };



  // Handle perubahan jabatan
 const handleJabatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedId = e.target.value;

  // Cari posisi berdasarkan ID yang dipilih
  const selectedPos = positions.find((pos) => pos.id === selectedId);

  setFormData((prev) => ({
    ...prev,
    id_position: selectedId,
    gaji: selectedPos ? selectedPos.gaji : 0,
  }));
};



  // Ambil data posisi berdasarkan department yang dipilih
  useEffect(() => {
    const fetchPositionsByDepartment = async () => {
      if (!selectedDepartment) return;

      try {
        const res = await api.get(`/admin/positions`, {
          params: { department_id: selectedDepartment }, // optional: jika butuh filter posisi by department
        });

        const posisiFormatted = res.data.data.map((pos: any) => ({
          id: pos.id,
          name: pos.name,
          gaji: pos.gaji ?? 0,
        }));

        setPositions(posisiFormatted);
      } catch (err) {
        console.error("Gagal mengambil jabatan:", err);
      }
    };

    fetchPositionsByDepartment();
  }, [selectedDepartment]);

  const handleBack = () => router.push("/manager/employee");

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (updated.start_date) {
        const start = new Date(updated.start_date);
        const end = updated.end_date ? new Date(updated.end_date) : new Date();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedValue: string | number = value;

      if (["gaji", "uang_lembur", "denda_terlambat"].includes(name)) {
        updatedValue = parseFloat(value) || 0;
      }

      const updated = {
        ...prev,
        [name]: updatedValue,
      };

      updated.total_gaji =
        (typeof updated.gaji === "number"
          ? updated.gaji
          : parseFloat(updated.gaji as string)) +
        (typeof updated.uang_lembur === "number"
          ? updated.uang_lembur
          : parseFloat(updated.uang_lembur as string)) -
        (typeof updated.denda_terlambat === "number"
          ? updated.denda_terlambat
          : parseFloat(updated.denda_terlambat as string));

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
      toast.error("ID posisi harus dalam format UUID yang benar!");
      return;
    }

    try {
      const data = new FormData();

      // Tambahkan properti biasa (kecuali dokumen)
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "dokumen") return; // abaikan dokumen di sini

        if (value instanceof File) {
          data.append(key, value);
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });

      // Tambahkan dokumen satu per satu
      formData.dokumen.forEach((file: File) => {
        data.append("dokumen[]", file);
      });
      await api.post("/admin/employees", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data berhasil ditambahkan!");
      router.push("/manager/employee");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data) {
        const data = error.response.data;

        if (data.errors) {
          const messages = Object.entries(data.errors)
            .map(([field, msgs]) => {
              const text = Array.isArray(msgs) ? msgs.join(", ") : msgs;
              return `${field}: ${text}`;
            })
            .join("\n");

          toast.error(`Gagal menambahkan data:\n${messages}`);
        } else if (typeof data.message === "string") {
          toast.error(`Gagal menambahkan data: ${data.message}`);
        } else {
          toast.error(`Gagal menambahkan data: ${JSON.stringify(data)}`);
        }

        console.error("Detail error:", data);
      } else {
        toast.error("Gagal menambahkan data karyawan. Silakan coba lagi.");
        console.error(error);
      }
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
        <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10">
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

        {/* <div>
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
        </div> */}
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
            htmlFor="password"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="input"
            value={formData.password}
          />
        </div>
     
        <div>
          <label
            htmlFor="phone_number"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nomor Telepon
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="number"
            placeholder="Enter phone number"
            onChange={handleChange}
            className="input"
            value={formData.phone_number}
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
            type="email"
            placeholder="Enter email"
            onChange={handleChange}
            className="input"
            value={formData.email}
          />
        </div>

        <div>
          <label
            htmlFor="tempat_lahir"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tempat Lahir
          </label>
          <input
            id="tempat_lahir"
            name="tempat_lahir"
            placeholder="Enter birthplace"
            onChange={handleChange}
            className="input"
            value={formData.tempat_lahir}
          />
        </div>

        <div>
          <label
            htmlFor="tanggal_lahir"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tanggal Lahir
          </label>
          <input
            id="tanggal_lahir"
            name="tanggal_lahir"
            type="date"
            onChange={handleChange}
            className="input"
            value={formData.tanggal_lahir}
          />
        </div>

        <div>
          <label
            htmlFor="jenis_kelamin"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Jenis Kelamin
          </label>
          <select
            id="jenis_kelamin"
            name="jenis_kelamin"
            onChange={handleChange}
            className="input"
            value={formData.jenis_kelamin}
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
            htmlFor="start_date"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Mulai Kerja
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleDateChange}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Akhir Kerja
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleDateChange}
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="tanggal_efektif"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tanggal Efektif
          </label>
          <input
            type="date"
            id="tanggal_efektif"
            name="tanggal_efektif"
            value={formData.tanggal_efektif}
            onChange={handleDateChange}
            className="input"
          />
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
            htmlFor="tipe_kontrak"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Tipe Kontrak
          </label>
          <div className="flex items-center gap-4 col-span-2">
            {["Tetap", "Kontrak", "Magang"].map((val) => (
              <label
                key={val}
                className="flex items-center cursor-pointer hover:text-blue-500"
              >
                <input
                  type="radio"
                  name="tipe_kontrak"
                  value={val}
                  checked={formData.tipe_kontrak === val}
                  onChange={handleChange}
                />
                {" " + val}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[20px] font-bold text-[#141414]">
            Departemen
          </label>
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
            htmlFor="no_rek"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Nomor Rekening
          </label>
          <input
            id="no_rek"
            name="no_rek"
            type="number"
            placeholder="Enter bank account number"
            onChange={handleChange}
            className="input"
            value={formData.no_rek}
          />
        </div>

        <div>
          <label
            htmlFor="uang_lembur"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Uang Lembur
          </label>
          <input
            id="uang_lembur"
            name="uang_lembur"
            type="number"
            placeholder="Enter overtime pay"
            onChange={handleChange}
            className="input"
            value={formData.uang_lembur}
          />
        </div>
        <div>
          <label
            htmlFor="denda_terlambat"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Denda Terlambat
          </label>
          <input
            id="denda_terlambat"
            name="denda_terlambat"
            type="number"
            placeholder="Enter late fine"
            onChange={handleChange}
            className="input"
            value={formData.denda_terlambat}
          />
        </div>
        <div>
          <label
            htmlFor="total_gaji"
            className="block text-[20px] font-bold text-[#141414]"
          >
            Total Gaji
          </label>
          <input
            id="total_gaji"
            name="total_gaji"
            type="number"
            placeholder="Enter total salary"
            onChange={handleChange}
            className="input"
            value={formData.total_gaji}
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
            onClick={() => (window.location.href = "/manager/employee")}
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
    </div>

  );
}