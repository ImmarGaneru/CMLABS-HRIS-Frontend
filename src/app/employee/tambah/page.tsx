"use client";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import { createEmployee } from "../../../../utils/employee"; // pastikan path-nya benar



export default function TambahKaryawan() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
const [positions, setPositions] = useState<{id: string; name: string}[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);

  // Fetch posisi saat komponen mount
  useEffect(() => {
    async function fetchPositions() {
      try {
        const res = await fetch('/api/positions');
        if (!res.ok) throw new Error("Failed to fetch positions");
        const data = await res.json();
        setPositions(data);
      } catch (error) {
        console.error(error);
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    }
    fetchPositions();
  }, []);
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
    cabang: "",
    bank: "",
    norek: "",
    dokumen: null as File | null,
  });


  const handleBack = () => router.push("/employee");

  const handleUploadClick = () => fileInputRef.current?.click();
// Tambahkan fungsi baru untuk handle dokumen
const [preview, setPreview] = useState<string | null>(null);

const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData((prev) => ({ ...prev, avatar: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }
};


const handleDokumenChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData((prev) => ({ ...prev, dokumen: file }));
  }
};



  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData((prev) => ({ ...prev, dokumen: file }));
  //     const reader = new FileReader();
  //     reader.onloadend = () => setPreview(reader.result as string);
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
  };
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    const data = new FormData();

    // Masukkan semua properti kecuali file
    Object.entries(formData).forEach(([key, value]) => {
      // Kalau value adalah File, masukkan langsung
      if (value instanceof File) {
        data.append(key, value);
      } else if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    await createEmployee(data);

    alert('Data berhasil ditambahkan');
    router.push('/employee');
  } catch (error: any) {
    if (error.response && error.response.data) {
      alert('Gagal menambahkan data karyawan:\n' + JSON.stringify(error.response.data, null, 2));
      console.error('Detail error:', error.response.data);
    } else {
      alert('Gagal menambahkan data karyawan.');
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
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </div>

      <div>
        <label
          htmlFor="id_user"
          className="block text-[20px] font-bold text-[#141414]"
        >
          ID_User
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
          First Name
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
          Last Name
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
          Address
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
          Phone Number
        </label>
        <input
          id="notelp"
          name="notelp"
          placeholder="Enter phone number"
          onChange={handleChange}
          className="input"
          value={formData.notelp}
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
          placeholder="Enter email"
          onChange={handleChange}
          className="input"
          value={formData.email}
        />
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
          value={formData.jadwal}
        >
          <option value="">Select work schedule</option>
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
          {["Tetap", "Kontrak", "Lepas"].map((val) => (
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
          placeholder="Enter grade"
          onChange={handleChange}
          className="input"
          value={formData.grade}
        />
      </div>

      <div>
  <label
    htmlFor="jabatan"
    className="block text-[20px] font-bold text-[#141414]"
  >
    Jabatan
  </label>
  <select
    id="jabatan"
    name="jabatan"
    onChange={handleChange}
    className="input"
    value={formData.jabatan}
  >
    <option value="">-- Pilih Jabatan --</option>
    {positions.map((pos) => (
      <option key={pos.id} value={pos.name}>
        {pos.name}
      </option>
    ))}
  </select>
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
          placeholder="Enter bank account number"
          onChange={handleChange}
          className="input"
          value={formData.norek}
        />
      </div>

     <div className="col-span-2">
  <label className="block text-[20px] font-bold text-[#141414]">
    Upload Dokumen
  </label>
  <div className="relative">
    <input
      name="dokumen[]"            // pake array supaya multiple file bisa diterima backend
      type="file"
      accept=".pdf,.docx"
      multiple                    // penting supaya bisa pilih banyak file sekaligus
      onChange={handleDokumenChange}
      className="input-file w-full border p-3 rounded-md cursor-pointer hover:border-blue-500 pl-12"
    />
    <FaFileUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600" />
  </div>
</div>


      <div className="col-span-2 flex justify-end gap-4">
        <button
          type="button"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          onClick={() => window.location.href = "/employee"}
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
