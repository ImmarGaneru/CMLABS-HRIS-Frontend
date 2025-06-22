"use client";

import React from "react";
import { CheckCircle } from "lucide-react"; // Optional icon

export default function SolusiHR() {
  const solusi = [
    {
      title: "Dashboard",
      desc: "Ringkasan informasi penting seperti jumlah karyawan, absensi, dan pengajuan terbaru untuk pemantauan HR yang efektif.",
    },
    {
      title: "Karyawan",
      desc: "Manajemen data karyawan seperti biodata, posisi, dan riwayat kerja dalam satu tempat.",
    },
    {
      title: "Kehadiran",
      desc: "Mencatat absensi harian, izin, keterlambatan, dan cuti secara akurat dan real-time.",
    },
    {
      title: "Jadwal",
      desc: "Mengatur jadwal kerja divisi atau karyawan, mendukung perubahan shift dengan mudah.",
    },
    {
      title: "Approval",
      desc: "Menyetujui atau menolak pengajuan karyawan seperti cuti atau lembur secara transparan.",
    },
    {
      title: "Settings & App Payment",
      desc: "Konfigurasi sistem, role, dan langganan SaaS untuk HRIS sesuai kebutuhan perusahaan.",
    },
  ];

  return (
    <section className="px-6 sm:px-8 py-16 bg-[#f8f8f8]">
      <div className="text-center mb-14">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] leading-tight">
          Solusi HRIS
          <br />
          <span className="text-[#7CA5BF] font-bold">Untuk Website CMLABS</span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          Fitur utama HRIS yang dirancang untuk membantu manajemen sumber daya manusia secara efisien dan digital.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {solusi.map((item, index) => (
          <div
            key={index}
            className="group bg-gradient-to-br from-[#1E3A5F] via-[#7CA5BF]/40 to-[#7CA5BF] p-[2px] rounded-3xl transition-transform hover:scale-[1.02]"
          >
            <div className="bg-white rounded-3xl p-6 h-full shadow-md flex flex-col text-center items-center justify-start">
              <div className="mb-3 bg-[#1E3A5F]/10 text-[#1E3A5F] p-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
