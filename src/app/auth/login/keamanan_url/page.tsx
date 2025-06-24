'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface KeamananURLProps {
  role: 'admin' | 'employee';
  children: ReactNode;
}

export default function KeamananURL({ role, children }: KeamananURLProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    // Jangan jalanin kalau bukan client
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;

    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (err) {
      console.error('Gagal parse user:', err);
      user = null;
    }

    if (!token || !user) {
      router.push('/auth/login/email');
      return;
    }

    // Deteksi role
    let userRole: 'admin' | 'employee' | null = null;

    if (user?.workplace?.id_manager && user.id === user.workplace.id_manager) {
      userRole = 'admin';
    } else if (user?.employee) {
      userRole = 'employee';
    }

    console.log('Detected role:', userRole, 'Required:', role);

    if (userRole !== role) {
      router.push('/auth/login/email');
    } else {
      setAllowed(true);
    }
  }, [role, router]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
