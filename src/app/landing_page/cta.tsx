'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

export default function CTA() {
  const [showKontak, setShowKontak] = useState(false);

  const toggleKontak = () => {
    setShowKontak((prev) => !prev);
  };

  return (
    <section className="px-8 py-20 bg-gray-50 flex flex-col-reverse lg:flex-row items-center gap-12">
      {/* Kiri: Text */}
      <div className="lg:w-1/2 space-y-6 text-left">
        <h2
          className="leading-tight"
          style={{
            fontSize: "64px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "bold",
            color: "#1E3A5F"
          }}
        >
          Siap Mengubah<br />Cara Anda<br />Mengelola SDM?
        </h2>
        <p className="text-[#1E3A5F] text-base">
          Coba HRIS <strong>gratis 14 hari</strong> — tidak perlu kartu kredit
        </p>

        {/* Tombol */}
        <div className="flex gap-4">
          {/* Tombol Hubungi Kami */}
          <div className="relative">
            <button
              onClick={toggleKontak}
              className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-[24px] p-1 text-white flex items-center"
            >
              <span className="inline-block bg-white text-[#1E3A5F] rounded-[20px] px-6 py-2 text-sm font-medium">
                Hubungi Kami
              </span>
            </button>

            {/* Box Kontak muncul di bawah tombol Hubungi Kami */}
            {showKontak && (
              <div className="absolute mt-2 bg-[#1E3A5F] text-white rounded-lg p-4 w-64 shadow z-10">
                <h4 className="text-lg font-semibold mb-2">Kontak</h4>
                <p className="flex items-center gap-2 text-gray-300">
                  <FaPhone /> +62 864 2086 4208
                </p>
                <p className="flex items-center gap-2 text-gray-300 mt-2">
                  <FaEnvelope /> cmlabshris@mail.com
                </p>
              </div>
            )}
          </div>

          {/* Tombol Demo Gratis */}
          <Link
            href="/auth/register"
            className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-[24px] p-1 text-white items-center"
          >
            <span className="inline-block bg-white text-[#1E3A5F] rounded-[20px] px-6 py-2 text-sm font-medium">
              Demo Gratis
            </span>
          </Link>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="lg:w-1/2">
        <div
          className="rounded-[24px] p-[4px]"
          style={{
            background: 'linear-gradient(to right, #7CA5BF, #1E3A5F)',
          }}
        >
          <Image
            src="/Dashboard.png"
            alt="Dashboard aplikasi"
            width={600}
            height={400}
            className="rounded-[20px] w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
