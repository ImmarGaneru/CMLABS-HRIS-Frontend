// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { splitName } from "@/utils/text";

// export default function GoogleCallbackContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted) return;

//     const token = searchParams.get("token");
//     const is_new_user = searchParams.get("is_new_user");
//     const name = searchParams.get("name");
//     const email = searchParams.get("email");
//     const login_method = searchParams.get("login_method");

//     const loginMethodLower = login_method?.toLowerCase();
//     console.log("login_method:", loginMethodLower);

//     if (typeof token === "string") {
//       if (is_new_user === "true") {
//         const { first_name, last_name } = splitName(name || "");

//         router.replace(
//           `/auth/register?first_name=${first_name}&last_name=${last_name}&email=${email}`
//         );
//       } else {
//         localStorage.setItem("token", token);

//         if (loginMethodLower === "email") {
//           router.replace("/manager/dashboard");
//         } else if (
//           loginMethodLower === "id_karyawan" ||
//           loginMethodLower === "nomer_telepon"
//         ) {
//           router.replace("/employee/dashboard");
//         } else {
//           router.replace("/");
//         }
//       }
//     }
//   }, [isMounted, router, searchParams]);

//   return null;
// }

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
    const login_method = searchParams.get("login_method");

    const loginMethodLower = login_method?.toLowerCase();
    console.log("login_method:", loginMethodLower);

    if (typeof token === "string") {
      const userData = {
        email,
        is_admin: loginMethodLower === "email" ? "1" : "0", // asumsikan berdasarkan login_method
      };
    
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    
      if (is_new_user === "true") {
        const { first_name, last_name } = splitName(name || "");
        router.replace(
          `/auth/register?first_name=${first_name}&last_name=${last_name}&email=${email}`
        );
      } else {
        if (loginMethodLower === "email") {
          router.replace("/manager/dashboard");
        } else if (
          loginMethodLower === "id_karyawan" ||
          loginMethodLower === "nomor_telepon"
        ) {
          router.replace("/employee/dashboard");
        } else {
          router.replace("/");
        }
      }
    }
    
  }, [isMounted, router, searchParams]);

  return null;
}