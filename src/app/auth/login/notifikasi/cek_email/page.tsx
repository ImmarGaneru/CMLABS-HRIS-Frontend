"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CekEmailPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("email_reset");
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Content */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-8 w-full max-w-md text-center">
        <img
          src="/logo-email.svg"
          alt="Email Icon"
          className="w-12 h-12 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cek Email-mu</h1>
        <p className="text-sm text-gray-700 mb-1">
          Kami mengirimkan tautan pengaturan ulang kata sandi ke email Anda{" "}
          {email ? (
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              ({email})
            </a>
          ) : (
            <span className="font-semibold">(email tidak ditemukan)</span>
          )}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          yang berlaku selama 24 jam setelah menerima email. <br />
          Silakan periksa kotak masuk Anda!
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

        {/* Bagian link kiri */}
        <div className="text-left text-xs text-gray-700 space-y-1">
          <p>
            Tidak menerima pesan?{" "}
            <Link
              href="/auth/login/notifikasi/cek_email"
              className="text-blue-600 font-medium hover:underline"
            >
              Tekan untuk kirim ulang
            </Link>
          </p>
          <Link
            href="/auth/login/email"
            className="text-blue-600 font-medium hover:underline inline-block"
          >
            Kembali ke halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
