'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RiLogoutBoxLine, RiUserFill } from '@remixicon/react';

import { useAuth } from '@/hooks/use-auth';
import * as FancyButton from '@/components/ui/fancy-button';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-paragraph-md text-text-sub-600'>Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-bg-white-0 p-4'>
      <div className='mx-auto max-w-4xl'>
        asdasd
        <div className='flex items-center justify-between rounded-20 bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex items-center gap-4'>
            <div className='flex size-12 items-center justify-center rounded-full bg-bg-soft-200'>
              <RiUserFill className='size-6 text-text-sub-600' />
            </div>
            <div>
              <h1 className='text-title-h5 text-text-strong-950'>
                Admin Dashboard
              </h1>
              <p className='text-paragraph-sm text-text-sub-600'>
                Welcome back, {user.email}
              </p>
            </div>
          </div>

          <FancyButton.Root
            variant='neutral'
            size='medium'
            onClick={handleSignOut}
          >
            <RiLogoutBoxLine className='size-4' />
            Sign Out
          </FancyButton.Root>
        </div>
        <div className='mt-6 rounded-20 bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <h2 className='mb-4 text-title-h6 text-text-strong-950'>
            User Information
          </h2>
          <div className='space-y-3'>
            <div>
              <span className='text-paragraph-sm font-medium text-text-sub-600'>
                Email:
              </span>
              <span className='ml-2 text-paragraph-sm text-text-strong-950'>
                {user.email}
              </span>
            </div>
            <div>
              <span className='text-paragraph-sm font-medium text-text-sub-600'>
                User ID:
              </span>
              <span className='ml-2 text-paragraph-sm text-text-strong-950'>
                {user.id}
              </span>
            </div>
            <div>
              <span className='text-paragraph-sm font-medium text-text-sub-600'>
                Last Sign In:
              </span>
              <span className='ml-2 text-paragraph-sm text-text-strong-950'>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        asdasd
      </div>
    </div>
  );
}
