"use client";

import { ChangeEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type FormFields = {
  first_name: string;
  last_name: string;
  company_name: string;
  company_address: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
};

type ValidationErrors = {
  [K in keyof FormFields]?: string[];
};

const fields: { label: string; key: keyof FormFields; type?: string }[] = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Company Name", key: "company_name" },
  { label: "Company Address", key: "company_address" },
  { label: "Email", key: "email", type: "email" },
  { label: "Nomor Telepon", key: "phone_number" },
  { label: "Password", key: "password", type: "password" },
  { label: "Confirm Password", key: "password_confirmation", type: "password" },
];

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const first_name = searchParams.get("first_name") || "";
  const last_name = searchParams.get("last_name") || "";
  const initialEmail = searchParams.get("email") || "";

  const [formData, setFormData] = useState<FormFields>({
    first_name,
    last_name,
    company_name: "",
    company_address: "",
    email: initialEmail,
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.data) {
          setErrors(result.data);
        } else {
          alert(result.message || "Gagal mendaftar");
        }
        return;
      }

      alert("Pendaftaran berhasil!");
      router.push("/auth/login/email");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row">
      {/* Kiri */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-start text-white pt-8 p-10 bg-white">
        <img
          src="/icon.jpg"
          alt="HRIS Icon"
          className="w-full h-64 mb-6 object-cover"
        />
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(to right, #7CA5BF, #1E3A5F)",
          }}
        >
          HRIS
        </h1>
        <p className="mt-4 text-center max-w-md text-gray-700 text-lg">
          Platform HRIS all-in-one untuk otomatisasi payroll, absensi, dan
          analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>
      </div>

      {/* Kanan */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2">
            Daftar HRIS
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Daftarkan akunmu dan manage karyawan dengan mudah dengan HRIS
          </p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map(({ label, key, type }) => {
              const isPassword = key === "password";
              const isConfirmPassword = key === "password_confirmation";

              if (isPassword || isConfirmPassword) {
                const show = isPassword ? showPassword : showConfirmPassword;
                const toggle = isPassword ? togglePassword : toggleConfirmPassword;
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-sm text-gray-600">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? "text" : "password"}
                        name={key}
                        placeholder={label}
                        value={formData[key]}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 pr-10 rounded-md border ${
                          errors[key] ? "border-red-500" : "border-gray-300"
                        } bg-white text-sm`}
                      />
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
                      >
                        <img
                          src={
                            show ? "/password_on.svg" : "/password_off.svg"
                          }
                          alt="Toggle Password"
                          className="w-5 h-5"
                          style={{
                            filter: show
                              ? "brightness(0) saturate(100%) invert(42%) sepia(100%) saturate(624%) hue-rotate(180deg) brightness(96%) contrast(90%)"
                              : "none",
                          }}
                        />
                      </button>
                    </div>
                    {errors[key] && (
                      <p className="text-red-500 text-sm">{errors[key]?.[0]}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={key} className="space-y-1">
                  <label className="text-sm text-gray-600">{label}</label>
                  <input
                    type={type || "text"}
                    name={key}
                    placeholder={label}
                    value={formData[key]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    } bg-white text-sm`}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]?.[0]}</p>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4 mb-3"
            >
              Daftar Sekarang
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                Metode Lain
              </span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`}
              passHref
            >
              <button
                type="button"
                className="cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold text-sm"
              >
                <span>Masuk dengan akun Google</span>
                <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
              </button>
            </Link>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah pernah daftar?{" "}
            <Link
              href="/auth/login/email"
              className="text-blue-600 font-medium"
            >
              Masuk disini
            </Link>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Dengan menekan tombol daftar, saya telah membaca dan menyetujui
            serta patuh kepada{" "}
            <a href="#" className="text-blue-600">
              Syarat & Ketentuan HRIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
