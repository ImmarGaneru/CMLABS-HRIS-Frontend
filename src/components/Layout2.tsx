"use client";

import { usePathname } from "next/navigation";
import { SidebarApp } from "./SidebarApp";
import { SidebarEmployee } from "./SidebarEmployee";
import { SidebarProvider } from "./ui/sidebar";
import Head from "next/head";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Navbar3 } from "./Navbar3";
import { Navbar4 } from "./Navbar4";
import NavbarEmployee from "./NavbarEmployee";

export default function Layout2({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

    const usesSidebar = () => {
        // Define all routes that should use the sidebar
        return pathname.startsWith("/manager") ||
            pathname.startsWith("/payment") ||
            pathname.startsWith("/subscription") ||
            pathname.startsWith("/profile")||
            pathname.startsWith("/lettering") 

    }

    const usesEmployeeSidebar = () => {
        // Define all routes that should use the sidebar
        return pathname.startsWith("/employee")
    }

    // Handle special layout for lupa_password and link_expired
    if (
        pathname.startsWith("/login/notifikasi/lupa_password") ||
        pathname.startsWith("/login/notifikasi/cek_email") ||
        pathname.startsWith("/login/notifikasi/sukses_password") ||
        pathname.startsWith("/login/notifikasi/link_expired") ||
        pathname.startsWith("/login/notifikasi/kode_password") ||
        pathname.startsWith("/login/notifikasi/ubah_password")
    ) {
        return (
            <Navbar4>
                {children}
            </Navbar4>
        )
    }

  // Handle special layout for lupa_password and link_expired
  if (
    pathname.startsWith("/auth/login/notifikasi/lupa_password") ||
    pathname.startsWith("/auth/login/notifikasi/cek_email") ||
    pathname.startsWith("/auth/login/notifikasi/sukses_password") ||
    pathname.startsWith("/auth/login/notifikasi/link_expired") ||
    pathname.startsWith("/auth/login/notifikasi/kode_password") ||
    pathname.startsWith("/auth/login/notifikasi/ubah_password")
  ) {
    return <Navbar4>{children}</Navbar4>;
  }

  // Layout dengan Sidebar untuk bagian dalam aplikasi
  if (usesSidebar()) {
    return (
      <SidebarProvider>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SidebarApp />
        <div className="flex-1 flex flex-col bg-gray-300">
          <Navbar3 />
          <div className="flex-1">
            <main>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

    // Layout dengan Sidebar untuk bagian dalam aplikasi
    if (usesEmployeeSidebar()) {
        return (
            <SidebarProvider>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <SidebarEmployee />
                <div className="flex-1 flex flex-col bg-gray-300">
                    <NavbarEmployee />
                    <div className="flex-1">
                        <main>{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        );
    }

  // Default layout with Navbar and Footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
