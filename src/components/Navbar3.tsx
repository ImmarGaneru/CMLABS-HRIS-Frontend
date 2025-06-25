'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { RiNotification4Fill } from 'react-icons/ri';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User, CreditCard, LogOut } from 'lucide-react';
import { searchableItems } from '@/config/searchConfig';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import api from "@/lib/axios";

// Interfaces
interface SubscriptionData {
    id: string;
    id_company: string;
    packageType?: PackageType;
    is_trial: boolean;
    status: string;
}

interface PackageType {
    id: string;
    name: string;
}

interface EmployeeData {
    first_name: string;
    last_name: string;
    avatar: string | null | undefined;
}

interface UserData {
    id: string;
    email: string;
    employee?: EmployeeData;
    workplace?: {
        id: string;
        name: string;
        address: string;
        deleted_at: string | null;
        subscription?: SubscriptionData;
    };
}

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function Navbar3() {
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname?.split("/") || [];
    const role = segments[1] || "";
    const page = segments[2] || "";

    // Perbaikan penggunaan template literal dengan backtick dan ${}
    const pageTitle = page
        ? `${capitalize(page)} ${capitalize(role)}`
        : capitalize(role || "Dashboard");

    const [userName, setUserName] = useState<string>('User');
    const [packageType, setPackageType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string>('/avatar.png');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getFullImageUrl = (path: string | undefined | null): string => {
        if (!path || path.trim() === "") return '/avatar.png';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        // Perbaikan template literal
        return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get('/auth/me');
                // Cek status dengan benar
                if (userResponse.status !== 200) return;

                const userData: UserData = userResponse.data.data;
                let nameToShow = 'User';

                if (userData.employee) {
                    const { first_name, last_name } = userData.employee;
                    nameToShow = `${first_name}${last_name ? ` ${last_name}` : ''}`;
                }
                setUserName(nameToShow);

                const avatarPath = userData.employee?.avatar;
                console.log('EMPLOYEE AVATAR:', avatarPath);
                console.log('HASIL FULL URL:', getFullImageUrl(avatarPath));

                setProfileImage(getFullImageUrl(avatarPath));
                setPackageType(userData.workplace?.subscription?.packageType?.name ?? null);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleNavigation = (path: string) => router.push(path);
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchOpen(true);
    };

    const handleSelect = (path: string) => {
        router.push(path);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const filteredItems = searchableItems.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(searchLower) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
            item.category.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flex items-center justify-between border-b h-16 px-6 bg-white">
            <div className="flex items-center gap-4">
                <SidebarTrigger>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SidebarTrigger>
                <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>
            </div>

            <div className="flex w-120 min-w-3xs sm:flex-row items-center sm:items-center justify-center">
                <div className="relative w-full max-w-lg min-w-3xs">
                    <Command className="rounded-lg border shadow-xs">
                        <CommandInput
                            placeholder="Search anything..."
                            value={searchQuery}
                            onValueChange={handleSearch}
                            className="py-2 px-4 "
                        />
                        {searchOpen && searchQuery && (
                            <CommandList className="absolute z-50 mt-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                <CommandEmpty>No results found.</CommandEmpty>
                                {Object.entries(
                                    filteredItems.reduce((acc, item) => {
                                        if (!acc[item.category]) {
                                            acc[item.category] = [];
                                        }
                                        acc[item.category].push(item);
                                        return acc;
                                    }, {} as Record<string, typeof filteredItems>)
                                ).map(([category, items]) => (
                                    <CommandGroup key={category} heading={category}>
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.path}
                                                onSelect={() => handleSelect(item.path)}
                                                className="flex items-center gap-2"
                                            >
                                                <span>{item.title}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}
                            </CommandList>
                        )}
                    </Command>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="p-4 text-[#1E3A5F] hover:text-[#155A8A] transition duration-200 ease-in-out cursor-pointer">
                    <RiNotification4Fill size={24} />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 rounded-md p-2 hover:shadow-sm transition-shadow"
                        >
                            {/* ✅ Gunakan img biasa agar domain localhost:8000 bisa muncul */}
                            <img
                                src={profileImage}
                                alt="Profile Picture"
                                width={32}
                                height={32}
                                className="rounded-full border border-gray-300"
                                onError={(e) => {
                                    e.currentTarget.src = "/avatar.png";
                                }}
                            />
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                Hi, {isLoading ? '...' : userName}
                            </span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-56" align="end">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleNavigation('/manager/profile')}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleNavigation('/manager/subscription')}
                            >
                                <CreditCard className="mr-2 h-auto w-4" />
                                <div className='flex flex-col items-start'>
                                    <span>Subscription</span>
                                    {packageType && (
                                        <span className="text-xs text-muted-foreground">
                                            ({packageType})
                                        </span>
                                    )}
                                </div>
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start text-red-600 hover:text-red-700"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
