"use client"

import { usePathname } from "next/navigation"
import { SidebarApp } from "./SidebarApp"
import { SidebarProvider } from "./ui/sidebar"
import Head from "next/head"
import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Navbar3 } from "./Navbar3"
import { Navbar4 } from "./Navbar4"

export default function Layout2({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const usesSidebar = () => {
        // Define all routes that should use the sidebar
        return pathname.startsWith("/attendance") || pathname.startsWith("/dashboard")|| pathname.startsWith("/employee")
    }

    // Handle special layout 
    if (
        pathname.startsWith("/login/notifikasi/lupa_password") ||
        pathname.startsWith("/login/notifikasi/cek_email") ||
        pathname.startsWith("/login/notifikasi/sukses_password") ||
        pathname.startsWith("/login/notifikasi/link_expired") ||
        pathname.startsWith("/login/notifikasi/kode_password")
    ) {
        return (
            <Navbar4>
                {children}
            </Navbar4>
        )
    }

    // Layout with sidebar for attendance and dashboard pages
    if (usesSidebar()) {
        return (
            <SidebarProvider>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <SidebarApp />
                <div className="flex-1 flex flex-col">
                    <Navbar3 />
                    <div className="flex-1 p-6">
                        <main>{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        )
    }

    // Default layout with Navbar and Footer
    return (
        <>
            <Navbar />
            <main className="min-h-screen px-4 py-6">{children}</main>
            <Footer />
        </>
    )
}
