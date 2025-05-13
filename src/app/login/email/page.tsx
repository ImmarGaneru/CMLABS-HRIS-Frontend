'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

export default function LoginEmailPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8] flex-col md:flex-row p-4">
      {/* KIRI: Section HRIS */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-start text-white pt-8 p-10">
        <img
          src="/HR_image.png"
          alt="HRIS Icon"
          className="max-w-lg mb-6 object-contain"
        />
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(to right, #7CA5BF, #1E3A5F)',
          }}
        >
          HRIS
        </h1>
        <p className="mt-4 text-center max-w-md text-gray-700 text-lg">
          Platform HRIS all-in-one untuk otomatisasi payroll, absensi, dan
          analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>
      </div>

      {/* KANAN: Kotak Form Login */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2 leading-tight">
            Masuk HRIS
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Selamat datang kembali di HRIS cmlabs! Atur semua dengan mudah
          </p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          <form className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="alamat@email.com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="--- --- ---"
                  className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <LuEye className="w-5 h-5 text-[#2D8EFF]" />
                  ) : (
                    <LuEyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Ingat saya + Lupa Password */}
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

            {/* Tombol Masuk */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              {/* Daftar Sekarang */}
              Masuk
            </button>

            {/* Divider Metode Lain */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                Metode Lain
              </span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            {/* Tombol alternatif */}
            <Link href="/login/id_karyawan">
              <button className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300">
                Masuk dengan ID Karyawan
              </button>
            </Link>

            <Link href="/login/nomor_telepon">
              <button className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300">
                Masuk dengan Nomor Telepon
              </button>
            </Link>

            <button
              onClick={() => {
                window.location.href = '/api/auth/google';
              }}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            >
              <span>Masuk dengan akun Google</span>
              <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
            </button>
          </form>

          {/* Link Daftar */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Belum memiliki akun?{' '}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Daftar lewat sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
