'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define protected routes
  const protectedRoutes = ['/admin'];
  const authRoutes = ['/admin/login'];
  const publicAuthRoutes = ['/admin/reset-password']; // Routes that both authenticated and unauthenticated users can access

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname.startsWith(route) &&
      !authRoutes.some((authRoute) => pathname.startsWith(authRoute)) &&
      !publicAuthRoutes.some((publicRoute) => pathname.startsWith(publicRoute)),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  React.useEffect(() => {
    if (!loading) {
      // Redirect to login if accessing protected route without session
      if (isProtectedRoute && !user) {
        router.push('/login');
        return;
      }

      // Redirect to admin dashboard if accessing auth routes with session
      if (isAuthRoute && user) {
        router.push('/admin');
        return;
      }
    }
  }, [user, loading, router, pathname, isProtectedRoute, isAuthRoute]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-paragraph-md text-text-sub-600'>Loading...</div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (isProtectedRoute && !user) {
    return null;
  }

  if (isAuthRoute && user) {
    return null;
  }

  return <>{children}</>;
}
