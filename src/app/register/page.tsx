'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      {/* KANAN: Form Register */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2 leading-tight">
            Daftar HRIS
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Daftarkan akunmu dan manage karyawan dengan mudah dengan HRIS
          </p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          <form className="space-y-4">
            {[
              'Nama Depan',
              'Nama Belakang',
              'Nama Perusahaan',
              'Email',
              'Nomor Telepon',
            ].map((label, i) => (
              <div key={i} className="space-y-1">
                <label className="text-sm text-gray-600">{label}</label>
                <input
                  type="text"
                  placeholder={label}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Password Field */}
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

            {/* Konfirmasi Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src={showConfirmPassword ? '/password_on.svg' : '/password_off.svg'}
                    alt="Toggle Confirm Password"
                    className="w-5 h-5"
                    style={{
                      filter: showConfirmPassword
                        ? 'invert(44%) sepia(91%) saturate(3086%) hue-rotate(191deg) brightness(99%) contrast(101%)'
                        : 'none',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Dropdown */}
            {/* Ini diganti, dibawa ke halaman pemilihan paket */}
            {/* <div className="flex gap-2">
              <div className="w-1/2">
                <label className="text-sm text-gray-600">Paket Premium</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 text-sm">
                  <option>Paket Premium</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-sm text-gray-600">Jumlah Seat</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 text-sm">
                  <option>51 - 100 Seat</option>
                </select>
              </div>
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4 mb-3"
            >
              Selanjutnya
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                Metode Lain
              </span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            {/* Login Google */}
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

          {/* Footer */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah pernah daftar?{' '}
            <Link href="/login/email" className="text-blue-600 font-medium">
              Masuk disini
            </Link>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Dengan menekan tombol daftar, saya telah membaca dan menyetujui serta patuh kepada{' '}
            <a href="#" className="text-blue-600">
              Syarat & Ketentuan HRIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
