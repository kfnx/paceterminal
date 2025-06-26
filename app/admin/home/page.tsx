'use client';

import Link from 'next/link';
import { RiOutletLine } from '@remixicon/react';

import { CURATED_TOKENS } from '@/lib/tokens';
import { useAuth } from '@/hooks/use-auth';
import * as Button from '@/components/ui/button';
import WidgetTransactionsTable from '@/components/widgets/widget-transactions-table';

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
      <h3 className='text-2xl font-bold'>Select Token</h3>
      <WidgetTransactionsTable />
      {CURATED_TOKENS.map((token) => (
        <Link key={token.address} href={`/admin/${token.address}`}>
          <div className='flex items-center gap-2'>
            <img
              src={`/images/tokens/${token.icon}`}
              alt={token.name}
              className='size-10'
            />
            {token.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
