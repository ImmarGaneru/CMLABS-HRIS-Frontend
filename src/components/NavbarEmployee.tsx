'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { employeeSearchableItems } from '@/config/searchConfig';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User, LogOut } from 'lucide-react';
import api from "@/lib/axios";

export default function NavbarEmployee() {
    const pathname = usePathname();
    const router = useRouter();
    const pageTitle = pathname?.split("/")[2] || "Dashboard";

    const [userName, setUserName] = useState<string>('User');
    const [profileImage, setProfileImage] = useState<string>('/avatar.png');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get('/auth/me');
                const userData = userResponse.data.data;
                let nameToShow = 'User';
                if (userData.employee) {
                    const { first_name, last_name } = userData.employee;
                    nameToShow = `${first_name}${last_name ? ` ${last_name}` : ''}`;
                }
                setUserName(nameToShow);
                if (userData.employee?.avatar) {
                    setProfileImage(userData.employee.avatar);
                } else {
                    setProfileImage('/avatar.png');
                }
            } catch (error) {
                setUserName('User');
                setProfileImage('/avatar.png');
            }
        };
        fetchUserData();
    }, []);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

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
        setMenuOpen(false);
    };

    const filteredItems = employeeSearchableItems.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(searchLower) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
            item.category.toLowerCase().includes(searchLower)
        );
    });

    return (
        <nav className="w-full border-b bg-white flex items-center justify-between px-4 h-16 relative z-20">
            {/* Left: Hamburger for mobile, title for desktop */}
            <div className="flex items-center gap-2">
                <button
                    className="md:hidden p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold capitalize hidden md:block">{pageTitle}</h1>
            </div>

            {/* Center: Search bar */}
            <div className="flex-1 flex justify-center items-center">
                <div className="relative w-full max-w-lg">
                    <Command className="rounded-lg border shadow-xs">
                        <CommandInput
                            placeholder="Search..."
                            value={searchQuery}
                            onValueChange={handleSearch}
                            className="py-2 px-4"
                        />
                        {searchOpen && searchQuery && (
                            <CommandList className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
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

            {/* Right: Avatar and menu */}
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
                            className="rounded-full border"
                        />
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {userName}
                        </span>
                    </Button>
                </PopoverTrigger>
                
                <PopoverContent className='w-fit'>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleNavigation('/employee/profile')}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
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

            {/* Mobile menu (slide down) */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-md flex flex-col md:hidden z-30 animate-slide-down">
                    <div className="flex flex-col gap-2 p-4">
                        {employeeSearchableItems.map(item => (
                            <button
                                key={item.path}
                                onClick={() => handleSelect(item.path)}
                                className="text-left py-2 px-2 rounded hover:bg-gray-100 text-gray-700"
                            >
                                {item.title}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="mt-2 px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
} 