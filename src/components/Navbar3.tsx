'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { RiNotification4Fill } from 'react-icons/ri';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User, CreditCard, LogOut, Search } from 'lucide-react';
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
    package_type: string;
    seats: number;
    price_per_seat: number;
    is_trial: boolean;
    trial_ends_at: string;
    starts_at: string | null;
    ends_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface EmployeeData {
    first_name: string;
    last_name: string;
    avatar: string;
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

export function Navbar3() {
    const pathname = usePathname();
    const router = useRouter();
    const pageTitle = pathname?.split("/")[1] || "Dashboard";

    const [userName, setUserName] = useState<string>('User');
    const [packageType, setPackageType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string>('/avatar.png');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Hardcoded token sementara
    const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get('http://api.hriscmlabs.my.id/api/auth/me');

                if (!userResponse.status) throw new Error('Failed to fetch user');

                // const responseJson = await userResponse.data
                // console.log('Full API Response:', responseJson); // Debug log

                const userData: UserData = userResponse.data;

                // Debug logs
                console.log('User Data:', userData);
                console.log('Employee Data:', userData.employee);
                console.log('Workplace Data:', userData.workplace);

                // Ambil nama dari employee
                let nameToShow = 'User';
                if (userData.employee) {
                    const { first_name, last_name } = userData.employee;
                    nameToShow = `${first_name}${last_name ? ` ${last_name}` : ''}`;
                } else {
                    console.log('No employee data found in response');
                }

                setUserName(nameToShow);

                if (userData.employee?.avatar) {
                    setProfileImage(userData.employee?.avatar);
                } else {
                    setProfileImage('/avatar.png');
                }


                // Cek subscription jika punya company
                if (userData.workplace?.id) {
                    if (userData.workplace.subscription?.package_type) {
                        setPackageType(userData.workplace.subscription.package_type);
                    } else {
                        console.log('No subscription data found in workplace');
                    }
                } else {
                    console.log('No workplace data found in user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // atau Cookies.remove('token')
        router.push('/');
    };

    // Search functionality
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
            {/* Left: Sidebar trigger + page title */}
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

            {/* Right: User avatar + name */}
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
                            <Image
                                src={profileImage}
                                alt="Profile Picture"
                                width={32}
                                height={32}
                                className="rounded-full"
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
                                onClick={() => handleNavigation('/profile')}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleNavigation('/subscription')}
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