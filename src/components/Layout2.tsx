"use client"

import { usePathname } from "next/navigation"
import { SidebarApp } from "./SidebarApp"
import { SidebarProvider,  } from "./ui/sidebar"
// import { Button } from "./ui/button"
// import { Menu } from "lucide-react"
import Head from "next/head"
import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Navbar3 } from "./Navbar3"

export default function Layout2({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const usesSidebar = () => {
        // Define all routes that should use the sidebar
        return pathname.startsWith("/attendance") || pathname.startsWith("/dashboard")|| pathname.startsWith("/employee")
    }

    if (usesSidebar()) {
        return (
            <SidebarProvider>
                <Head>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <SidebarApp/>
                <div className="flex-1 flex flex-col">
                    <Navbar3/>
                    <div className="flex-1 p-6">
                        <main>{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen px-4 py-6">{children}</main>
            <Footer />
        </>
    )
}
