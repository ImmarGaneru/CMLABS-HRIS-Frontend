"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { LuEyeOff } from "react-icons/lu";
// import { LuEye } from "react-icons/lu";
import api from "@/lib/axios";

export default function LoginEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/signin", {
        email,
        password,
      });

      const result = await response.data;

      console.log("Response result:", result);

      if (response.data && result.meta?.success) {
        const token = result.data?.token;

        if (token) {
          localStorage.setItem("token", token);

          if (result.data.user) {
            // ⬇️ Tambahkan log di sini
      console.log("User object:", result.data.user);
            localStorage.setItem("user", JSON.stringify(result.data.user));
          }

          if (result.data.user) {
  const user = result.data.user;
  localStorage.setItem("user", JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    is_admin: user.is_admin, // <- pastikan ini ikut
  }));
}

          alert("Login berhasil!");
          router.push("/manager/dashboard");
        } else {
          throw new Error("Token tidak ditemukan dalam response.");
        }
      } else {
        const errorMessage = result.meta?.message || "Login gagal.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row">
      {/* KIRI */}
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
          analitik SDM.
        </p>
      </div>

      {/* KANAN */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2 leading-tight">
            Masuk HRIS
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Selamat datang kembali di HRIS cmlabs!
          </p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alamat@email.com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="--- --- ---"
                  className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none cursor-pointer"
                >
                  <img
                    src={
                      showPassword ? "/password_on.svg" : "/password_off.svg"
                    }
                    alt="Toggle Password"
                    className="w-5 h-5"
                    style={{
                      filter: showPassword
                        ? "brightness(0) saturate(100%) invert(42%) sepia(100%) saturate(624%) hue-rotate(180deg) brightness(96%) contrast(90%)"
                        : "none",
                    }}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Ingat saya
                </label>
              </div>
              <Link
                href="/auth/login/notifikasi/lupa_password"
                className="text-xs text-blue-500 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              Masuk Sekarang
            </button>

            <div className="flex items-center gap-2 my-3">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                Metode Lain
              </span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            <Link href="/auth/login/id_karyawan">
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2 cursor-pointer"
              >
                Masuk dengan ID Karyawan
              </button>
            </Link>

            <Link href="/auth/login/nomor_telepon">
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2 cursor-pointer"
              >
                Masuk dengan Nomor Telepon
              </button>
            </Link>

            <Link
  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect?login_method=email`}
  passHref
>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm cursor-pointer"
              >
                <span>Masuk dengan akun Google</span>
                <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
              </button>
            </Link>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Belum memiliki akun?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Daftar lewat sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
