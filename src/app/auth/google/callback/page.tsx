
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const isNewUser = searchParams.get('is_new_user');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'employee');
      localStorage.setItem('user', JSON.stringify({ role, name, email }));

      if (isNewUser === 'true') {
        router.push('/auth/setup-profile');
      } else {
        if (role === 'admin') {
          router.push('/manager/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      }
    } else {
      router.push('/auth/login/email');
    }
  }, [router, searchParams]);

  return <p>Loading...</p>;
}
