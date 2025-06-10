"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LupaPasswordPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await api.post("/forgot-password", {
      email: (e.target as HTMLFormElement).email.value,
    });

    if (response.data.meta.success) {
      router.push("/auth/login/notifikasi/cek_email");
    } else {
      alert(
        response.data.meta.message || "Terjadi kesalahan, silakan coba lagi."
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Form */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password</h1>
        <p className="text-sm text-gray-600 mb-4">
          Jangan khawatir ketika anda lupa password. Kirimkan nomor telepon
          terdaftar anda, kami akan kirimkan kode verifikasi untuk reset
          password anda.
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

        <form className="text-left space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="phone_number" className="text-sm text-gray-700">
              No Telepon
            </label>
            <input
              id="phone_number"
              placeholder="0812-3456-7890"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Reset Password
          </button>
        </form>

        <Link
          href="/auth/login/email"
          className="text-sm text-blue-600 hover:underline mt-4 inline-block"
        >
          Kembali ke halaman Login
        </Link>
      </div>
    </div>
  );
}
