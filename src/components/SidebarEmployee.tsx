"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  ClipboardCheck,
  AlarmClock,
  Mails,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";

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
  },
];

function SwitchModeButton() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      if (typeof window === "undefined") return;
  
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        console.warn("User data not found in localStorage");
        setIsAdmin(false);
        return;
      }
  
      try {
        const user = JSON.parse(userRaw);
        const adminStatus = user?.is_admin === 1 || user?.is_admin === "1";
        console.log("Detected user role (is_admin):", user?.is_admin);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setIsAdmin(false);
      }
    }, [pathname]);
  
    if (!pathname.startsWith("/employee")) return null;
  
    const handleClick = () => {
      if (!isAdmin) {
        alert("Hanya dapat diakses oleh Manager");
        return;
      }
      router.push("/manager/dashboard");
    };
  
    return (
      <button
        onClick={handleClick}
        disabled={!isAdmin}
        className={cn(
          "flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors",
          isAdmin
            ? "hover:bg-accent hover:text-accent-foreground text-[#1E3A5F] cursor-pointer"
            : "text-muted-foreground cursor-not-allowed"
        )}
        title={isAdmin ? "Switch ke Manager Mode" : "Hanya dapat diakses oleh Manager"}
        type="button"
      >
        <UserCircle className="mr-2 h-4 w-4" />
        <span>Manager Mode</span>
      </button>
    );
  }
  

export function SidebarEmployee() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="mb-4">
        <div className="flex justify-center">
          <Image src="/Logo.svg" alt="Logo" width={120} height={120} />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 flex flex-col justify-start items-center gap-6">
        <SidebarGroup className="mt-20">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-start gap-2">
              {sidebarNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="w-full">
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center rounded-full px-4 py-2 w-full text-sm font-medium text-[#1E3A5F]",
                      pathname === item.url
                        ? "bg-[#1E3A5F] text-white"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
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
