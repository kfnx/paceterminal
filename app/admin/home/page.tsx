'use client';

import Link from 'next/link';
import { RiOutletLine } from '@remixicon/react';

import { CURATED_TOKENS } from '@/lib/tokens';
import { useAuth } from '@/hooks/use-auth';
import * as Button from '@/components/ui/button';
import WidgetAdminTokens from '@/components/widgets/widget-admin-tokens';

export default function PageHome() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:p-8'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>{user?.email}</p>
        <Link href='/admin/logout'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-fit'
          >
            <Button.Icon>
              <RiOutletLine />
            </Button.Icon>
            Logout
          </Button.Root>
        </Link>
      </div>
      <Button.Root variant='primary' size='medium' className='w-fit'>
        Add New Token
      </Button.Root>
      <h3 className='text-2xl font-bold'>Token Management</h3>
      <WidgetAdminTokens />
    </div>
  );
}
