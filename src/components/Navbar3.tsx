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
import { User, CreditCard, LogOut } from 'lucide-react';

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

    // Hardcoded token sementara
    const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch('http://localhost:8000/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!userResponse.ok) throw new Error('Failed to fetch user');

                const responseJson = await userResponse.json();
                console.log('Full API Response:', responseJson); // Debug log
                
                const userData: UserData = responseJson.data;

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

                // Cek subscription jika punya company
                if (userData.workplace?.id) {
                    if(userData.workplace.subscription?.package_type){
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

            {/* Right: User avatar + name */}
            <div className="flex items-center gap-3">
                <div className="p-4 text-[#1E3A5F] hover:text-[#155A8A] transition duration-200 ease-in-out cursor-pointer">
                    <RiNotification4Fill size={24} />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Image
                                src="/avatar.png"
                                alt="User Avatar"
                                width={32}
                                height={32}
                                className="rounded-full cursor-pointer"
                            />
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

                <span className="text-sm text-muted-foreground">
                    Hi, {isLoading ? '...' : userName}
                </span>
            </div>
        </div>
    );
}