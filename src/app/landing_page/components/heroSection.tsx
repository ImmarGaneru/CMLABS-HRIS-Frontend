'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center px-20 py-10 bg-[#f8f8f8] gap-8">
      {/* Bagian Kiri (Teks dan Form) */}
      <div className="lg:w-1/2 space-y-6 justify-start">
        <h1 className="text-6xl font text-[#1E3A5F] leading-tight">
          Kelola SDM Lebih Efisien dengan
          <div className="text-6xl font-bold text-[#1E3A5F]">HRIS</div>
        </h1>
        <p className="text-gray-700">
          Platform HRIS all-in-one untuk otomasi payroll, absensi, dan analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>

        <div
          className="flex gap-4 items-center justify-between"
          style={{
            backgroundColor: '#D9D9D9',
            borderRadius: '32px',
            padding: '8px',
            width: '80%',
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-4 py-2 w-64 border-none rounded-l-full bg-transparent outline-none"
          />

          <Link href="/auth/register" className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-[24px] p-1 text-white items-center">
            <span className="inline-block bg-white text-[#1E3A5F] rounded-[20px] px-6 py-2 text-sm font-medium">
              Demo Gratis
            </span>
          </Link>
        </div>
      </div>

      {/* Bagian Kanan (Gambar) */}
      <div className="lg:w-1/2 flex justify-center">
        <Image
          src="/HR_image.png"
          alt="Dashboard"
          width={2500}
          height={2500}
          className="max-w-full h-auto"
        />
      </div>
    </section>
  );
}
