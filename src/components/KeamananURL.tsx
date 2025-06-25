"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface KeamananURLProps {
  role: "admin" | "employee";
  children: ReactNode;
}

export default function KeamananURL({ role, children }: KeamananURLProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      console.warn("Token atau user tidak ditemukan. Redirect ke login.");
      router.replace("/auth/login/email");
      return;
    }

    let user = null;
    try {
      user = JSON.parse(userString);
    } catch (err) {
      console.error("Gagal parse user dari localStorage:", err);
      localStorage.clear();
      router.replace("/auth/login/email");
      return;
    }

    // Logging untuk debugging
    console.log("localStorage user:", user);

    // Ambil role dari user
    const userRole: string | null = user?.role || null;

    console.log("Detected role:", userRole, "Required:", role);
    console.log("localStorage user:", user);

    if (userRole === role) {
      setAllowed(true);
    } else {
      console.log("Role tidak sesuai. Redirect ke login.");
      router.replace("/auth/login/email");
    }
  }, [role, router]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
} 