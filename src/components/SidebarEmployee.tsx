"use client";

import Link from "next/link";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Clock,
    CalendarDays,
    ClipboardCheck,
    AlarmClock,
    Mails,
    UserCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton, SidebarFooter, SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JSX } from "react";

const sidebarNavItems = [
    {
        title: "Dashboard",
        url: "/employee/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Kehadiran",
        url: "/employee/attendance",
        icon: Clock,
    },
    {
        title: "Approval",
        url: "/employee/approval",
        icon: ClipboardCheck,
    },
    {
        title: "Overtime",
        url: "/employee/overtime",
        icon: AlarmClock,
    },
    {
        title: "Lettering",
        url: "/employee/lettering",
        icon: Mails,
    }
];

function SwitchModeButton(): JSX.Element | null {
    const pathname = usePathname();
    const [isManager, setIsManager] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userRaw = localStorage.getItem("user");
            if (userRaw) {
                try {
                    const user = JSON.parse(userRaw);
                    const isUserManager = user?.workplace?.id_manager === user?.id;
                    setIsManager(isUserManager);
                } catch (e) {
                    setIsManager(false);
                }
            } else {
                setIsManager(false);
            }
        }
    }, []);

    if (isManager === null) return null; // loading di client, hindari mismatch

    const isManagerRoute = pathname.startsWith("/manager");

    return (
        <Link
            href={isManagerRoute ? "/employee/dashboard" : "/manager/dashboard"}
            className="flex items-center rounded-full px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>{isManagerRoute ? "Employee Mode" : "Manager Mode"}</span>
        </Link>
    );
}

export function SidebarEmployee() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarHeader className="mb-4">
                <div className="flex justify-center">
                    <Image src="/Logo.svg" alt="Logo" width={120} height={120} className="mr-2" />
                </div>
            </SidebarHeader>
            <SidebarContent className="flex-1 flex flex-col  justify-start items-center gap-6">
                <SidebarGroup className="mt-20">
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col items-start gap-2">
                            {sidebarNavItems.map((item) => (
                                <SidebarMenuItem key={item.title} className="w-full rounded-full">
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            id={`${item.title.toLowerCase()}-tutorial`}
                                            className={cn(
                                                "flex items-center rounded-full px-4 py-2 w-full text-4xl font-medium text-[#1E3A5F]",
                                                pathname === item.url ? "bg-[#1E3A5F] text-white rounded-full" : "hover:bg-accent hover:text-accent-foreground"
                                            )}
                                            replace
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-col gap-2 mb-12">
                <SwitchModeButton />
            </SidebarFooter>
        </Sidebar>
    );
}