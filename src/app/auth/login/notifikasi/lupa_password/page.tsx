"use client";

import Link from "next/link";

export default function LupaPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Form */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password</h1>
        <p className="text-sm text-gray-600 mb-4">
          Jangan khawatir ketika anda lupa password. Kirimkan email terdaftar
          anda, kami akan kirimkan link reset password
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

        <form className="text-left space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="alamat@email.com"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Link
            href="/auth/login/notifikasi/cek_email"
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Reset Password
          </Link>
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
