

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { splitName } from "@/utils/text";

export default function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = searchParams.get("token");
    const is_new_user = searchParams.get("is_new_user");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (typeof token === "string") {
      if (is_new_user === "true") {
        const { first_name, last_name } = splitName(name || "");

        // Redirect ke register dengan query param untuk pre-fill form
        router.replace(
          `/auth/register?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}&email=${encodeURIComponent(email || "")}`
        );
      } else {
        // Login biasa: simpan token & role, redirect sesuai role
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "employee");

        if (role === "admin") {
          router.replace("/manager/dashboard");
        } else {
          router.replace("/employee/dashboard");
        }
      }
    } else {
      router.replace("/auth/login/email"); // jika token tidak ada, redirect ke login
    }
  }, [isMounted, router, searchParams]);

  return null;
}

