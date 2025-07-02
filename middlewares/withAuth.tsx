// middleware/withAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth(Component: any, allowedRoles: string[]) {
  return function AuthGuard(props: any) {
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
      const isTokenExpired = () => {
        const token = user?.token; // Assuming the token is stored in user object
        const expiration = user?.expiration; // Assuming expiration time is stored
        if (!token || !expiration) return true; // No token or expiration found
        return Date.now() >= expiration; // Check if current time is past expiration
      };

      if (!user || !allowedRoles.includes(user.role) || isTokenExpired()) {
        localStorage.removeItem('user'); // Clear user data if token is expired
        router.push('/login');
      }
    }, [user, allowedRoles, router]);

    return <Component {...props} />;
  };
}
