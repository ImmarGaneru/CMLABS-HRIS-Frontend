'use client';

import Link from 'next/link';

export default function UbahPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Form */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Lupa Password</h1>
        <p className="text-sm text-gray-600 mb-2">
          Jangan khawatir jika Anda lupa password. <br />
          Perbarui password Anda, kami akan memprosesnya.
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-3" />

        <form className="text-left space-y-3">
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm text-gray-700">
              Password Baru
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Masukkan password baru"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm-password" className="text-sm text-gray-700">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Ulangi password baru"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Link
            href="/login/notifikasi/sukses_password"
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Ubah Password
          </Link>
        </form>

        <Link
          href="/login/email"
          className="text-xs text-blue-600 hover:underline mt-3 inline-block"
        >
          Kembali ke halaman Login
        </Link>
      </div>
    </div>
  );
}
