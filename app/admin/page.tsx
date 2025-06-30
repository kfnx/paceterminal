'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine, RiCoinLine, RiUserLine } from '@remixicon/react';

import { useTokens } from '@/hooks/use-tokens';
import { useUsers } from '@/hooks/use-users';
import * as Button from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { total: tokensTotal, loading: tokensLoading } = useTokens(1, 1); // Just get the count
  const { users, loading: usersLoading } = useUsers();

  const handleManageTokens = () => {
    router.push('/admin/tokens');
  };

  const handleManageUsers = () => {
    router.push('/admin/users');
  };

  return (
    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-6'>
        <h1 className='text-title-h2 text-text-strong-950'>Admin Dashboard</h1>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Manage your application settings and content
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-sm'>
          <div className='mb-4'>
            <h3 className='mb-2 flex items-center gap-2 text-title-h4 text-text-strong-950'>
              <RiCoinLine className='size-5 text-primary-base' />
              Token Management
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Manage your token collection and settings
            </p>
          </div>
          <div className='mb-4'>
            <div className='text-title-h3 text-text-strong-950'>
              {tokensLoading ? '...' : tokensTotal}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Tokens
            </div>
          </div>
          <Button.Root onClick={handleManageTokens} className='w-full'>
            <Button.Icon as={RiAddLine} />
            Manage Tokens
          </Button.Root>
        </div>

        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-sm'>
          <div className='mb-4'>
            <h3 className='mb-2 flex items-center gap-2 text-title-h4 text-text-strong-950'>
              <RiUserLine className='size-5 text-primary-base' />
              User Management
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Manage user accounts and permissions
            </p>
          </div>
          <div className='mb-4'>
            <div className='text-title-h3 text-text-strong-950'>
              {usersLoading ? '...' : users.length}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Users
            </div>
          </div>
          <Button.Root onClick={handleManageUsers} className='w-full'>
            <Button.Icon as={RiAddLine} />
            Manage Users
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
