'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, MapPin, Briefcase, Calendar, RectangleEllipsis } from 'lucide-react';

interface EmployeeData {
    id: string;
    sign_in_code: string; // ✅ tambahkan ini
    first_name: string;
    last_name: string;
    avatar: string;
    address?: string | null;
    employment_status: string;
    tipeKontrak: string | null; // ✅ gunakan camelCase dan nullable
    id_position: string | null;
    position?: {
        name: string | null;
    };
}

interface WorkplaceData {
    id: string;
    name: string;
    address: string;
}

interface UserData {
    id: string;
    email: string;
    phone_number: string;
    employee: EmployeeData | null;
    workplace: WorkplaceData | null;
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<string>('/avatar.png');

    const [token] = useState("76|tb8nV2Eu25nHIg5IIIVpok5WGslKJkx85qzBda3Yad86900b");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://api.hriscmlabs.my.id/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                console.log('Response data:', data); // Debug log
                setUserData(data.data);

                const userData: UserData = data.data;

                if (userData.employee?.avatar) {
                    setProfileImage(userData.employee?.avatar);
                } else {
                    setProfileImage('/avatar.png');
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#1E3A5F]"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Failed to load user data</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={profileImage}
                                alt="Profile Picture"
                                width={120}
                                height={120}
                                className="rounded-full"
                            />
                        </div>
                        <CardTitle className="text-xl">
                            {userData.employee
                                ? `${userData.employee.first_name} ${userData.employee.last_name}`
                                : 'No employee data'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {userData.employee?.position?.name || 'Position not set'}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{userData.email}</span>
                            </div>
                            {userData.phone_number && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{userData.phone_number}</span>
                                </div>
                            )}
                            {userData.employee?.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{userData.employee.address}</span>
                                </div>
                            )}

                        </div>
                    </CardContent>
                </Card>

                {/* Employment Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Employment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>{userData.workplace?.name || 'Not assigned'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>{userData.employee?.position?.name || 'Not assigned'}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Employment Status</h3>
                                    <Badge variant="outline" className="mt-1">
                                        {userData.employee?.employment_status || 'Not set'}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contract Type</h3>
                                    <Badge variant="outline" className="mt-1">
                                        {userData.employee?.tipeKontrak || 'Not set'}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Address</h3>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{userData.workplace?.address || 'Not available'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Sign In Code</h3>
                                    <div className="flex items-center gap-2">
                                        <RectangleEllipsis className="h-4 w-4 text-muted-foreground" />
                                        {userData.employee ? (
                                            <span className='font-bold'>{userData.employee.sign_in_code}</span>
                                        ) : (
                                            <span className='font-bold'>Not available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 