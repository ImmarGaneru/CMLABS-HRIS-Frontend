import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Settings,
    UserCircle,
    LogOut,
    Clock,
    CalendarDays,
    ClipboardCheck,
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

const sidebarNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Karyawan",
        url: "/dashboard/profile",
        icon: UserCircle,
    },
    {
        title: "Kehadiran",
        url: "/attendance",
        icon: Clock,
    },
    {
        title: "Jadwal",
        url: "/schedule",
        icon: CalendarDays,
    },
    {
        title: "Approval",
        url: "/approval",
        icon: ClipboardCheck,
    },
];

export function SidebarApp() {
    const pathname = usePathname();

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
                                            className={cn(
                                                "flex items-center rounded-full px-4 py-2 w-full text-4xl font-medium text-[#1E3A5F] hover:bg-accent hover:text-accent-foreground",
                                                pathname === item.url ? "bg-[#1E3A5F] text-white rounded-full" : "transparent"
                                            )}
                                        >
                                            <item.icon className="mr-2 h-4 w-4"/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-col gap-2">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === "/settings" ? "bg-accent" : "transparent"
                    )}
                >
                    <Settings className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {

                    }}
                >
                    <LogOut className="mr-2 h-4 w-4"/>
                    Log out
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
