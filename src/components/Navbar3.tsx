'use client';

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {Input} from "@/components/ui/input";
import { RiNotification4Fill } from "react-icons/ri";

export function Navbar3() {
    const pathname = usePathname()

    // Optional: derive page title from pathname
    const pageTitle = pathname?.split("/")[1] || "Dashboard"

    return (
        <div className="flex items-center justify-between border-b h-16 px-6 bg-white">
            {/* Left: Sidebar trigger + page title */}
            <div className="flex items-center gap-4">
                <SidebarTrigger>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SidebarTrigger>
                <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>
            </div>

            <div className="flex w-100 sm:flex-row items-center sm:items-center justify-end gap-3">
                <Input placeholder="Search here..." className="max-w-sm" />
            </div>

            {/* Right: User avatar + name (example only) */}
            <div className="flex items-center gap-3">
                <div className="p-4 text-[#1E3A5F] hover:text-[#155A8A] transition duration-200 ease-in-out cursor-pointer">
                    <RiNotification4Fill size={24}/>
                </div>
                <Image
                src="/avatar.png"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
                />
                <span className="text-sm text-muted-foreground">Hi, Immar</span>
            </div>
        </div>
    )
}