'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiCoinLine,
  RiUserLine,
  RiUserStarLine,
} from '@remixicon/react';

import { useMembers } from '@/hooks/use-member';
import { useTokens } from '@/hooks/use-tokens';
import { useUsers } from '@/hooks/use-users';
import * as Button from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { total: tokensTotal, loading: tokensLoading } = useTokens(1, 1); // Just get the count
  const { users, loading: usersLoading } = useUsers();
  const { members, loading: membersLoading } = useMembers();

  const handleManageTokens = () => {
    router.push('/admin/tokens');
  };

  const handleManageUsers = () => {
    router.push('/admin/users');
  };

  const handleManageMembers = () => {
    router.push('/admin/members');
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
        <div className='flex flex-col justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-sm'>
          <div className='mb-4'>
            <p className='mb-2 flex items-center gap-2 text-title-h5 text-text-strong-950'>
              <RiCoinLine className='size-5 text-primary-base' />
              Token Management
            </p>
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

        <div className='flex flex-col justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-sm'>
          <div className='mb-4'>
            <p className='mb-2 flex items-center gap-2 text-title-h5 text-text-strong-950'>
              <RiUserStarLine className='size-5 text-primary-base' />
              Premium Members
            </p>
            <p className='text-paragraph-sm text-text-sub-600'>
              Manage members and their status
            </p>
          </div>
          <div className='mb-4'>
            <div className='text-title-h3 text-text-strong-950'>
              {membersLoading ? '...' : members.length}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Members
            </div>
          </div>
          <Button.Root onClick={handleManageMembers} className='w-full'>
            <Button.Icon as={RiAddLine} />
            Manage Members
          </Button.Root>
        </div>

        <div className='flex flex-col justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-sm'>
          <div className='mb-4'>
            <p className='mb-2 flex items-center gap-2 text-title-h5 text-text-strong-950'>
              <RiUserLine className='size-5 text-primary-base' />
              Admins
            </p>
            <p className='text-paragraph-sm text-text-sub-600'>
              Manage admin user accounts and permissions
            </p>
          </div>
          <div className='mb-4'>
            <div className='text-title-h3 text-text-strong-950'>
              {usersLoading ? '...' : users.length}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Admin
            </div>
          </div>
          <Button.Root onClick={handleManageUsers} className='w-full'>
            <Button.Icon as={RiAddLine} />
            Manage Admins
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
