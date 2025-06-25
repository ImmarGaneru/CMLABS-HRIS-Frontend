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
    const isNewUser = searchParams.get("is_new_user");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!token) {
      router.replace("/auth/login/email");
      return;
    }

    if (isNewUser === "true") {
      // Register flow: pre-fill form
      const { first_name, last_name } = splitName(name || "");
      router.replace(
        `/auth/register?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(
          last_name
        )}&email=${encodeURIComponent(email || "")}`
      );
    } else {
      // Login flow: simpan semua info
      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "employee");
      localStorage.setItem(
        "user",
        JSON.stringify({
          role,
          name,
          email,
        })
      );

      if (role === "admin") {
        router.replace("/manager/dashboard");
      } else {
        router.replace("/employee/dashboard");
      }
    }
  }, [isMounted, router, searchParams]);

  return null;
}
