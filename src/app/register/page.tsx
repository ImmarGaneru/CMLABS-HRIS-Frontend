'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

// Fungsi untuk standarisasi password
function isPasswordValid(password: string): boolean {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  // const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasUppercase && hasNumber;
}


type RegisterForm = {
  first_name: string;
  last_name: string;
  // username_perusahaan: string,
  address: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
};

const fields: { label: string; key: keyof RegisterForm }[] = [
  { label: 'Nama Depan', key: 'first_name' },
  { label: 'Nama Belakang', key: 'last_name' },
  // { label: 'Nama Perusahaan', key: 'username_perusahaan' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
  { label: 'Nomor Telepon', key: 'phone_number' },
];

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [compName, setCompName] = useState('');
  const [email, setEmail] = useState('');
  const [notelp, setNotelp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    compName: false,
    email: false,
    notelp: false,
  });
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    const newErrors = {
      firstName: firstName.trim() === '',
      lastName: lastName.trim() === '',
      compName: compName.trim() === '',
      email: email.trim() === '' || !/^\S+@\S+\.\S+$/.test(email),
      notelp: notelp.trim() === '',
      // password: password.trim().length < 8 || !/[A-Z]/.test(password),
    };

    setFieldErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors){
      setError('Pastikan semua field terisi dengan benar.');
      return;
    }

    if (password !== confirmPassword){
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    
    if (!isPasswordValid(password)) {
      setError('Password harus minimal 8 karakter, mengandung huruf besar dan angka.');
      return;
    }

    // Simulasi submit
    router.push('/login/email');
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
          Platform HRIS all-in-one untuk otomatisasi payroll, absensi, dan analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>
      </div>

      {/* Kanan */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2">Daftar HRIS</h2>
          <p className="text-sm text-gray-600 mb-2">Daftarkan akunmu dan manage karyawan dengan mudah dengan HRIS</p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          {/* Form login dan register harus memiliki style form yang sama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* {[
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
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm"
                />
              </div>
            ))} */}

            {/* Nama Depan */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Nama Depan</label>
              <input
                type="text"
                placeholder="Nama Depan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.firstName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>
            
            {/* Nama Belakang */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Nama Belakang</label>
              <input
                type="text"
                placeholder="Nama Belakang"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.lastName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>
            
            {/* Nama Perusahaan */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Nama Perusahaan</label>
              <input
                type="text"
                placeholder="Nama Perusahaan"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.compName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Nomor Telepon</label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={notelp}
                onChange={(e) => setNotelp(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.notelp ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="--- --- ---"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <LuEye className="w-5 h-5 text-[#2D8EFF]" />
                  ) : (
                    <LuEyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {/* Menampilkan Error */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-md border border-red-300">
                {error}
              </p>
            )}

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
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">Metode Lain</span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            <button
              onClick={() => (window.location.href = '/api/auth/google')}
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm"
            >
              <span>Masuk dengan akun Google</span>
              <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
            </button>
          </form>
          {/* End Form */}

          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah pernah daftar?{' '}
            <Link href="/login/email" className="text-blue-600 font-medium">
              Masuk disini
            </Link>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Dengan menekan tombol daftar, saya telah membaca dan menyetujui serta patuh kepada{' '}
            <a href="#" className="text-blue-600">Syarat & Ketentuan HRIS</a>
          </p>
        </div>
      </div>
    </div>
  );
}
