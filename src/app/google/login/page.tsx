"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginEmailPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }), // hanya kirim password
        }
      );

      const result = await response.json();
      console.log("Response result:", result);

      if (response.ok && result.meta?.success) {
        const token = result.data?.token;

        if (token) {
          localStorage.setItem("token", token);

          if (result.data.user) {
            localStorage.setItem("user", JSON.stringify(result.data.user));
          }

          alert("Login berhasil!");
          router.push("/dashboard");
        } else {
          throw new Error("Token tidak ditemukan dalam response.");
        }
      } else {
        const errorMessage = result.meta?.message || "Login gagal.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
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
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
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
                href="/login/notifikasi/lupa_password"
                className="text-xs text-blue-500 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-2 rounded-md transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Memproses..." : "Login Sekarang"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
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
