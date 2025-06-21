"use client";

import React from "react";

export default function SolusiHR() {
  const solusi = [
    {
      title: 'Dashboard',
      desc: 'Menyediakan ringkasan informasi penting seperti jumlah karyawan, absensi hari ini, jadwal aktif, dan pengajuan terbaru yang mempermudah pemantauan HR secara menyeluruh.',
    },
    {
      title: 'Karyawan',
      desc: 'Menyimpan data karyawan seperti biodata, posisi, status kerja, dan riwayat kerja. Mempermudah pencarian dan manajemen karyawan dalam satu tempat.',
    },
    {
      title: 'Kehadiran',
      desc: 'Mencatat absensi harian karyawan, termasuk keterlambatan, izin, dan cuti. HR dapat melacak kehadiran dengan mudah dan akurat.',
    },
    {
      title: 'Jadwal',
      desc: 'Menyusun dan menampilkan jadwal kerja harian atau mingguan untuk tiap divisi atau karyawan, serta memudahkan penyesuaian jika ada perubahan shift.',
    },
    {
      title: 'Approval',
      desc: 'Tempat untuk menyetujui atau menolak pengajuan dari karyawan seperti cuti, izin, atau lembur. Semua proses dapat dilacak dengan jelas oleh HR maupun atasan.',
    },
    {
      title: 'Settings & App Payment',
      desc: 'Konfigurasi sistem seperti role, preferensi akun, hingga informasi langganan aplikasi HRIS berbasis SaaS.',
    },
  ];

  return (
    <>

      <section className="px-8 py-16 bg-[#f8f8f8] text-center">
        <h2 className="text-[48px] font-bold text-[#1E3A5F] leading-snug mb-2">
          <span className="block">Solusi HRIS</span>
          <span className="block">Untuk Website CMLABS</span>
        </h2>

        <p className="text-gray-600 mt-4 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
          Fitur-fitur utama HRIS yang dirancang untuk membantu manajemen sumber daya manusia secara efisien dan efektif melalui sistem digital.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {solusi.map((item, index) => (
            <div
              key={index}
              className="rounded-[44px] p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
            >
              <div className="bg-white p-6 rounded-[40px] shadow-lg flex flex-col items-center text-center min-h-[200px]">
                <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
