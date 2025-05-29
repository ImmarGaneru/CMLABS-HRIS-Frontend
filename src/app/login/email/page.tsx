'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

export default function LoginEmailPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      console.log('Response result:', result);

      if (response.ok && result.meta?.success) {
        const token = result.data?.token;

        if (token) {
          localStorage.setItem('token', token);

          // Simpan data user jika diperlukan
          if (result.data.user) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
          }

          alert('Login berhasil!');
          router.push('/dashboard');
        } else {
          throw new Error('Token tidak ditemukan dalam response.');
        }
      } else {
        const errorMessage = result.meta?.message || 'Login gagal.';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat login');
    }
  };

  // Penanganan error Frontend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    // Validasi kosong
    if (!email || !password){
      setError('Email dan Password tidak boleh kosong.');
      return;
    }

    // Dummy untuk validasi login
    if (email != 'admin@email.com' || password != 'admin123'){
      setError('Email atau Password salah.');
      return;
    }

    // Dummy ketika valid
    router.push("/dashboard");
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

      {/* KANAN */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2 leading-tight">Masuk HRIS</h2>
          <p className="text-sm text-gray-600 mb-2">Selamat datang kembali di HRIS cmlabs!</p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />
          
          {/* Mulai Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Pesan Error */}
            {error && (
              <div className="text-sm text-red-500 bg-red-100 border border-red-300 px-3 py-2 rounded">
                {error}
              </div>
            )}
            
            {/* Email */}
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
                  type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? (
                    <LuEye className="w-5 h-5 text-[#2D8EFF]" />
                  ) : (
                    <LuEyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4" />
                <label htmlFor="remember" className="text-sm text-gray-600">Ingat saya</label>
              </div>
              <Link href="/login/notifikasi/lupa_password" className="text-xs text-blue-500 hover:underline">Lupa Password?</Link>
            </div>

            {/* Tombol Masuk */}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
              {/* Daftar Sekarang */}
              Masuk
            </button>

            <div className="flex items-center gap-2 my-3">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">Metode Lain</span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            <Link href="/login/id_karyawan">
              <button type="button" className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2">
                Masuk dengan ID Karyawan
              </button>
            </Link>

            <Link href="/login/nomor_telepon">
              <button type="button" className="w-full border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm mb-2">
                Masuk dengan Nomor Telepon
              </button>
            </Link>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/api/auth/google';
              }}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm"
            >
              <span>Masuk dengan akun Google</span>
              <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
            </button>
          </form>

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
