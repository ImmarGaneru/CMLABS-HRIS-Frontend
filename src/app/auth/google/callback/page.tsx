"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { splitName } from "@/utils/text";

export default function GoogleCallback() {
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

    if (typeof token === "string") {
      if (is_new_user === "true") {
        const { first_name, last_name } = splitName(name || "");

        router.replace(
          `/auth/register?first_name=${first_name}&last_name=${last_name}&email=${email}`
        );
      } else {
        console.log("Token:", token);

        localStorage.setItem("token", token);

        router.replace("/dashboard");
      }
    }
  }, [isMounted, router, searchParams]);

  if (!isMounted) return null;

  return <p>Redirecting...</p>;
}
