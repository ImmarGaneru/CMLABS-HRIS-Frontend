'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center px-8 py-20 bg-gray-50 gap-8">
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
          className="flex gap-4 items-center"
          style={{
            backgroundColor: '#D9D9D9',
            borderRadius: '32px',
            padding: '8px',
            width: '75%',
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-4 py-2 w-64 border-none rounded-l-full bg-transparent outline-none"
          />

          <a
            href="#"
            style={{
              background: 'linear-gradient(to right, #7CA5BF, #1E3A5F)',
              borderRadius: '24px',
              padding: '2px',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                backgroundColor: 'white',
                color: '#1E3A5F',
                borderRadius: '20px',
                padding: '6px 24px',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-block',
              }}
            >
              Demo Gratis
            </span>
          </a>
        </div>
      </div>

      {/* Bagian Kanan (Gambar) */}
      <div className="lg:w-1/2 flex justify-center">
        <Image
          src="/icon.jpg"
          alt="Dashboard"
          width={2500}
          height={2500}
          className="max-w-full h-auto"
        />
      </div>
    </section>
  );
}
