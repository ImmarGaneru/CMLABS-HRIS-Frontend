"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";

export default function UbahPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UbahPasswordForm />
    </Suspense>
  );
}

function UbahPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/reset-password", {
        email,
        token,
        password: (e.target as HTMLFormElement).newPassword.value,
        password_confirmation: (e.target as HTMLFormElement).confirmPassword
          .value,
      });

      if (response.data.meta.success) {
        router.push("/auth/login/notifikasi/sukses_password");

        return;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          !error.response?.data?.meta?.success &&
          error.response?.data?.data?.is_token_invalid
        ) {
          router.push("/auth/login/notifikasi/link_expired");
          return;
        } else {
          alert(
            error.response?.data?.meta?.message ||
              "Terjadi kesalahan, silakan coba lagi."
          );
        }
      } else {
        alert("Terjadi kesalahan, silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Form */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Lupa Password</h1>
        <p className="text-sm text-gray-600 mb-2">
          Jangan khawatir jika Anda lupa password. <br />
          Perbarui password Anda, kami akan memprosesnya.
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-3" />

        <form className="text-left space-y-3" onSubmit={handleSubmit}>
          {/* Password Baru */}
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm text-gray-700">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="new-password"
                name="newPassword"
                placeholder="Masukkan password baru"
                className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <img
                  src={showPassword ? "/password_on.svg" : "/password_off.svg"}
                  alt="Toggle Password"
                  className="w-5 h-5"
                  style={{
                    filter: showPassword
                      ? "brightness(0) saturate(100%) invert(44%) sepia(94%) saturate(747%) hue-rotate(183deg) brightness(101%) contrast(92%)"
                      : "none",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="text-sm text-gray-700">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirmPassword"
                placeholder="Ulangi password baru"
                className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <img
                  src={
                    showConfirmPassword
                      ? "/password_on.svg"
                      : "/password_off.svg"
                  }
                  alt="Toggle Confirm Password"
                  className="w-5 h-5"
                  style={{
                    filter: showConfirmPassword
                      ? "brightness(0) saturate(100%) invert(44%) sepia(94%) saturate(747%) hue-rotate(183deg) brightness(101%) contrast(92%)"
                      : "none",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Ubah Password
          </button>
        </form>

        {/* Link Kembali */}
        <Link
          href="/auth/login/email"
          className="text-xs text-blue-600 hover:underline mt-3 inline-block"
        >
          Kembali ke halaman Login
        </Link>
      </div>
    </div>
  );
}
