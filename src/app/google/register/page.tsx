"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterForm = {
  username_perusahaan: string;
  address: string; // Alamat pribadi
  address_company: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    username_perusahaan: "",
    address: "",
    address_company: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input kosong
    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value.trim() === ""
    );
    if (isAnyFieldEmpty) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mendaftar");
      }

      const result = await response.json();
      alert("Pendaftaran berhasil!");
      console.log(result);

      router.push("/auth/login/email");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row">
      {/* Kiri */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-start text-white pt-8 p-10 bg-white">
        <img
          src="/icon.jpg"
          alt="HRIS Icon"
          className="max-w-lg mb-6 object-contain"
        />
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(to right, #7CA5BF, #1E3A5F)",
          }}
        >
          HRIS
        </h1>
        <p className="mt-4 text-center max-w-md text-gray-700 text-lg">
          Platform HRIS all-in-one untuk otomatisasi payroll, absensi, dan
          analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>
      </div>

      {/* Kanan */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2">
            Daftar Akun Google
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Daftarkan akunmu dan manage karyawan dengan mudah dengan HRIS
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                Username Perusahaan
              </label>
              <input
                type="text"
                value={formData.username_perusahaan}
                onChange={(e) =>
                  handleChange("username_perusahaan", e.target.value)
                }
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                placeholder="Username Perusahaan"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Alamat Pribadi</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                placeholder="Alamat Pribadi"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Alamat Perusahaan</label>
              <input
                type="text"
                value={formData.address_company}
                onChange={(e) =>
                  handleChange("address_company", e.target.value)
                }
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                placeholder="Alamat Perusahaan"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Nomor Telepon</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                placeholder="Nomor Telepon"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src={
                      showPassword ? "/password_on.svg" : "/password_off.svg"
                    }
                    alt="Toggle Password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm pr-10"
                  placeholder="Konfirmasi Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src={
                      showConfirmPassword
                        ? "/password_on.svg"
                        : "/password_off.svg"
                    }
                    alt="Toggle Confirm Password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4"
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah pernah daftar?{" "}
            <Link
              href="/auth/login/email"
              className="text-blue-600 font-medium"
            >
              Masuk di sini
            </Link>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Dengan menekan tombol daftar, saya telah membaca dan menyetujui
            serta patuh kepada{" "}
            <a href="#" className="text-blue-600">
              Syarat & Ketentuan HRIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
